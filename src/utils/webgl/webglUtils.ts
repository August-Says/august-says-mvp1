
import { WebGLContext, ShaderUniforms, FrameBuffer } from './types';

export const initWebGL = (canvas: HTMLCanvasElement): WebGLContext | null => {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  // Try WebGL2 first
  let gl = canvas.getContext('webgl2', params) as WebGLContext;
  const isWebGL2 = !!gl;

  // Fall back to WebGL1 if needed
  if (!gl) {
    gl = (canvas.getContext('webgl', params) || 
         canvas.getContext('experimental-webgl', params)) as WebGLContext;
  }

  if (!gl) return null;

  // Add WebGL2 constants for WebGL1 context
  if (!isWebGL2) {
    gl.R16F = 0x822D;
    gl.RG16F = 0x822F;
    gl.RGBA16F = 0x881A;
    gl.RG = 0x8227;
    gl.RED = 0x1903;
    gl.HALF_FLOAT = 0x140B;
  }

  return gl;
};

export const createShader = (
  gl: WebGLContext,
  type: number,
  source: string
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export const compileShader = (
  gl: WebGLContext,
  type: number,
  source: string,
  defines: string[] = []
): WebGLShader | null => {
  const defineStr = defines.map(define => `#define ${define}\n`).join('');
  const shaderSource = defineStr + source;
  return createShader(gl, type, shaderSource);
};

export class Program {
  gl: WebGLContext;
  program: WebGLProgram | null;
  uniforms: ShaderUniforms;

  constructor(gl: WebGLContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.gl = gl;
    this.program = gl.createProgram();
    this.uniforms = {};

    if (!this.program) {
      console.error('Failed to create program');
      return;
    }

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Failed to link program:', gl.getProgramInfoLog(this.program));
      gl.deleteProgram(this.program);
      this.program = null;
      return;
    }

    // Get uniforms
    const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const uniformInfo = gl.getActiveUniform(this.program, i);
      if (!uniformInfo) continue;
      this.uniforms[uniformInfo.name] = gl.getUniformLocation(this.program, uniformInfo.name);
    }
  }

  bind() {
    if (this.program) {
      this.gl.useProgram(this.program);
    }
  }

  unbind() {
    this.gl.useProgram(null);
  }

  setUniforms(uniforms: { [name: string]: any }) {
    if (!this.program) return;

    this.bind();
    for (const name in uniforms) {
      if (!uniforms.hasOwnProperty(name)) continue;

      const value = uniforms[name];
      const location = this.uniforms[name];

      if (location === null) {
        console.warn(`Uniform '${name}' not found in shader`);
        continue;
      }

      if (Array.isArray(value)) {
        switch (value.length) {
          case 2:
            this.gl.uniform2fv(location, value);
            break;
          case 3:
            this.gl.uniform3fv(location, value);
            break;
          case 4:
            this.gl.uniform4fv(location, value);
            break;
          default:
            console.warn(`Unsupported array length for uniform '${name}': ${value.length}`);
        }
      } else if (typeof value === 'number') {
        this.gl.uniform1f(location, value);
      } else if (typeof value === 'boolean') {
        this.gl.uniform1i(location, value ? 1 : 0);
      } else if (value instanceof Float32Array) {
        this.gl.uniform1fv(location, value);
      } else {
        console.warn(`Unsupported type for uniform '${name}': ${typeof value}`);
      }
    }
  }
}

export class Material {
  gl: WebGLContext;
  program: Program;
  uniforms: { [name: string]: any };

  constructor(gl: WebGLContext, program: Program, uniforms: { [name: string]: any } = {}) {
    this.gl = gl;
    this.program = program;
    this.uniforms = uniforms;
  }

  setUniforms(uniforms: { [name: string]: any }) {
    this.uniforms = { ...this.uniforms, ...uniforms };
    this.program.setUniforms(this.uniforms);
  }

  bind() {
    this.program.bind();
    this.program.setUniforms(this.uniforms);
  }
}

export const createFBO = (
  gl: WebGLContext,
  width: number,
  height: number,
  texType: number,
  format: ExtensionFormats
): FrameBuffer => {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, format.internalFormat, width, height, 0, format.format, texType, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return { texture, fbo };
};

export const createDoubleFBO = (
  gl: WebGLContext,
  width: number,
  height: number,
  texType: number,
  format: ExtensionFormats
) => {
  let fbo1 = createFBO(gl, width, height, texType, format);
  let fbo2 = createFBO(gl, width, height, texType, format);
  
  return {
    get read() {
      return fbo1;
    },
    set read(value) {
      fbo1 = value;
    },
    get write() {
      return fbo2;
    },
    set write(value) {
      fbo2 = value;
    },
    swap: () => {
      const temp = fbo1;
      fbo1 = fbo2;
      fbo2 = temp;
    },
  };
};
