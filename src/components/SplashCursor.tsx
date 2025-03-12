import { useEffect, useRef } from 'react';
import { Material, Program, compileShader, initWebGL } from '../utils/webgl/webglUtils';
import { baseVertexShader, displayShaderSource } from '../utils/webgl/shaders';
import { WebGLContext, SplashCursorConfig } from '../utils/webgl/types';

function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1024,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 0.98,
  VELOCITY_DISSIPATION = 0.98,
  PRESSURE = 0.8,
  PRESSURE_ITERATIONS = 20,
  CURL = 30,
  SPLAT_RADIUS = 0.25,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 },
  TRANSPARENT = false,
}: Partial<SplashCursorConfig>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = initWebGL(canvas);
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    let ext = {
      formatRGBA: gl.getExtension('EXT_color_buffer_float'),
      formatRG: gl.getExtension('OES_texture_float_linear'),
      formatR: gl.getExtension('OES_texture_half_float_linear'),
      halfFloatTexType: gl.HALF_FLOAT,
      supportLinearFiltering: gl.getExtension('OES_texture_float_linear'),
    };

    if (ext.formatRGBA == null) {
      ext = {
        formatRGBA: { internalFormat: gl.RGBA, format: gl.RGBA },
        formatRG: { internalFormat: gl.RGBA, format: gl.RGBA },
        formatR: { internalFormat: gl.RGBA, format: gl.RGBA },
        halfFloatTexType: gl.UNSIGNED_BYTE,
        supportLinearFiltering: false,
      };
    } else {
      ext = {
        formatRGBA: { internalFormat: gl.RGBA16F, format: gl.RGBA },
        formatRG: { internalFormat: gl.RG16F, format: gl.RG },
        formatR: { internalFormat: gl.R16F, format: gl.RED },
        halfFloatTexType: gl.HALF_FLOAT,
        supportLinearFiltering: true,
      };
    }

    gl.clearColor(BACK_COLOR.r, BACK_COLOR.g, BACK_COLOR.b, TRANSPARENT ? 0 : 1);

    let simWidth = SIM_RESOLUTION;
    let simHeight = SIM_RESOLUTION;
    let dyeWidth = DYE_RESOLUTION;
    let dyeHeight = DYE_RESOLUTION;

    let density = createDoubleBuffer(simWidth, simHeight, ext.halfFloatTexType);
    let velocity = createDoubleBuffer(simWidth, simHeight, ext.halfFloatTexType);
    let divergence = createFBO(simWidth, simHeight, ext.halfFloatTexType);
    let curlFBO = createFBO(simWidth, simHeight, ext.halfFloatTexType);
    let pressure = createDoubleBuffer(simWidth, simHeight, ext.halfFloatTexType);

    let displayMaterial = new Material(baseVertexShader, displayShaderSource);

    let splatProgram = new Program(compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)!, compileShader(gl, gl.FRAGMENT_SHADER, splatShaderSource)!);
    let advectionProgram = new Program(compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)!, compileShader(gl, gl.FRAGMENT_SHADER, advectionShaderSource)!);
    let divergenceProgram = new Program(compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)!, compileShader(gl, gl.FRAGMENT_SHADER, divergenceShaderSource)!);
    let curlProgram = new Program(compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)!, compileShader(gl, gl.FRAGMENT_SHADER, curlShaderSource)!);
    let pressureProgram = new Program(compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)!, compileShader(gl, gl.FRAGMENT_SHADER, pressureShaderSource)!);
    let gradientSubtractProgram = new Program(compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)!, compileShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShaderSource)!);

    function createFBO(w: number, h: number, texType: number) {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, ext.formatRGBA.internalFormat, w, h, 0, ext.formatRGBA.format, texType, null);

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return fbo;
    }

    function createDoubleBuffer(w: number, h: number, texType: number) {
      let fbo1 = createFBO(w, h, texType);
      let fbo2 = createFBO(w, h, texType);
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
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.texture);
      gl.uniform1f(splatProgram.uniforms.uAspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.uPoint, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.uColor, color.r, color.g, color.b);
      gl.uniform1f(splatProgram.uniforms.uRadius, SPLAT_RADIUS / 100.0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      density.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.texture);
      gl.uniform3f(splatProgram.uniforms.uColor, dx, -dy, 1.0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();
    }

    function advect(dt: number) {
      advectionProgram.bind();
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.texture);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.texture);
      gl.uniform1f(advectionProgram.uniforms.uDeltaT, dt);
      gl.uniform1f(advectionProgram.uniforms.uDissipation, DENSITY_DISSIPATION);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      density.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.texture);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.texture);
      gl.uniform1f(advectionProgram.uniforms.uDissipation, VELOCITY_DISSIPATION);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();
    }

    function computeDivergence() {
      divergenceProgram.bind();
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function computeCurl() {
      curlProgram.bind();
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, curlFBO.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function solvePressure(iterations: number) {
      pressureProgram.bind();
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.texture);
      for (let i = 0; i < iterations; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        pressure.swap();
      }
    }

    function subtractGradient() {
      gradientSubtractProgram.bind();
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.texture);
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      velocity.swap();
    }

    function resizeCanvas() {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        displayMaterial.bind();
        gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
      }
    }

    let lastTime = Date.now();
    let colorCounter = 0;

    function update(ts: number) {
      resizeCanvas();

      const dt = Math.min((ts - lastTime) / 1000, 0.016);
      lastTime = ts;

      gl.viewport(0, 0, simWidth, simHeight);
      advect(dt);

      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        computeDivergence();
        solvePressure(1);
        subtractGradient();
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      displayMaterial.bind();
      gl.uniform1i(displayMaterial.uniforms.uTexture, density.read.texture);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(update);
    }

    let mouseIsDown = false;
    let lastMousePos = { x: 0, y: 0 };

    function handleMouseDown(e: MouseEvent) {
      mouseIsDown = true;
      lastMousePos = { x: e.offsetX, y: e.offsetY };
    }

    function handleMouseUp() {
      mouseIsDown = false;
    }

    function handleMouseMove(e: MouseEvent) {
      if (mouseIsDown) {
        const deltaX = e.offsetX - lastMousePos.x;
        const deltaY = e.offsetY - lastMousePos.y;

        const hue = Math.sin(colorCounter) * 360;
        const color = hslToRgb(hue, 0.5, 0.5);

        splat(e.offsetX, e.offsetY, deltaX * SPLAT_FORCE, deltaY * SPLAT_FORCE, color);

        lastMousePos = { x: e.offsetX, y: e.offsetY };
      }
    }

    function hslToRgb(h: number, s: number, l: number) {
      h /= 360;
      let r, g, b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return { r, g, b };
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    requestAnimationFrame(update);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      // Clean up WebGL resources here
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default SplashCursor;

const splatShaderSource = `
  precision highp float;
  uniform sampler2D uTarget;
  uniform float uAspectRatio;
  uniform vec2 uPoint;
  uniform vec3 uColor;
  uniform float uRadius;
  varying vec2 vUv;
  void main() {
      vec2 p = vUv - uPoint;
      p.x *= uAspectRatio;
      vec3 color = texture2D(uTarget, vUv).rgb;
      float dist = length(p);
      float radius = uRadius / uAspectRatio;
      if (dist < radius) {
          float alpha = smoothstep(radius, 0.0, dist);
          color += uColor * alpha;
      }
      gl_FragColor = vec4(color, 1.0);
  }
`;

const advectionShaderSource = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform float uDeltaT;
  uniform float uDissipation;
  varying vec2 vUv;
  void main() {
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      vec2 newUV = vUv + uDeltaT * velocity;
      newUV = clamp(newUV, 0.0, 1.0);
      vec4 sourceColor = texture2D(uSource, newUV);
      gl_FragColor = uDissipation * sourceColor;
  }
`;

const divergenceShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  vec2 texelSize = vec2(0.00390625, 0.00390625);
  void main() {
      float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
      float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const curlShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  vec2 texelSize = vec2(0.00390625, 0.00390625);
  void main() {
      float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
      float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
      float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
      float curl = 0.5 * (T - B - R + L);
      gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
  }
`;

const pressureShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  vec2 texelSize = vec2(0.00390625, 0.00390625);
  void main() {
      float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      float D = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - D) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  vec2 texelSize = vec2(0.00390625, 0.00390625);
  void main() {
      float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;
