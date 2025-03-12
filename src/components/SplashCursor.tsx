
import { useEffect, useRef } from 'react';
import { 
  Program, 
  compileShader, 
  initWebGL, 
  createFBO,
  createDoubleFBO
} from '../utils/webgl/webglUtils';
import { 
  baseVertexShader, 
  displayShaderSource, 
  splatShaderSource, 
  advectionShaderSource,
  divergenceShaderSource,
  curlShaderSource,
  pressureShaderSource,
  gradientSubtractShaderSource
} from '../utils/webgl/shaders';
import { WebGLContext, SplashCursorConfig, ExtensionFormats } from '../utils/webgl/types';

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

    // Initialize extensions and formats
    const formatRGBA: ExtensionFormats = {
      internalFormat: gl.RGBA16F || gl.RGBA,
      format: gl.RGBA
    };
    
    const formatRG: ExtensionFormats = {
      internalFormat: gl.RG16F || gl.RGBA,
      format: gl.RG || gl.RGBA
    };
    
    const formatR: ExtensionFormats = {
      internalFormat: gl.R16F || gl.RGBA,
      format: gl.RED || gl.RGBA
    };
    
    const halfFloatTexType = gl.HALF_FLOAT || 0x8D61; // 0x8D61 is HALF_FLOAT_OES
    const supportLinearFiltering = gl.getExtension('OES_texture_float_linear') != null;

    gl.clearColor(BACK_COLOR.r, BACK_COLOR.g, BACK_COLOR.b, TRANSPARENT ? 0 : 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set up WebGL
    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    
    const vertexArray = gl.createVertexArray 
      ? gl.createVertexArray() 
      : gl.getExtension('OES_vertex_array_object')?.createVertexArrayOES();
    
    if (gl.createVertexArray) {
      gl.bindVertexArray(vertexArray);
    } else if (gl.getExtension('OES_vertex_array_object')) {
      gl.getExtension('OES_vertex_array_object')?.bindVertexArrayOES(vertexArray);
    }
    
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let simWidth = SIM_RESOLUTION;
    let simHeight = SIM_RESOLUTION;
    let dyeWidth = DYE_RESOLUTION;
    let dyeHeight = DYE_RESOLUTION;

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, baseVertexShader);
    const displayShader = compileShader(gl, gl.FRAGMENT_SHADER, displayShaderSource, SHADING ? ['SHADING'] : []);
    const splatShader = compileShader(gl, gl.FRAGMENT_SHADER, splatShaderSource);
    const advectionShader = compileShader(gl, gl.FRAGMENT_SHADER, advectionShaderSource);
    const divergenceShader = compileShader(gl, gl.FRAGMENT_SHADER, divergenceShaderSource);
    const curlShader = compileShader(gl, gl.FRAGMENT_SHADER, curlShaderSource);
    const pressureShader = compileShader(gl, gl.FRAGMENT_SHADER, pressureShaderSource);
    const gradientSubtractShader = compileShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShaderSource);

    if (!vertexShader || !displayShader || !splatShader || !advectionShader || 
        !divergenceShader || !curlShader || !pressureShader || !gradientSubtractShader) {
      console.error('Failed to compile one or more shaders');
      return;
    }

    // Create programs
    const displayProgram = new Program(gl, vertexShader, displayShader);
    const splatProgram = new Program(gl, vertexShader, splatShader);
    const advectionProgram = new Program(gl, vertexShader, advectionShader);
    const divergenceProgram = new Program(gl, vertexShader, divergenceShader);
    const curlProgram = new Program(gl, vertexShader, curlShader);
    const pressureProgram = new Program(gl, vertexShader, pressureShader);
    const gradientSubtractProgram = new Program(gl, vertexShader, gradientSubtractShader);

    // Create framebuffers
    const density = createDoubleFBO(gl, dyeWidth, dyeHeight, halfFloatTexType, formatRGBA);
    const velocity = createDoubleFBO(gl, simWidth, simHeight, halfFloatTexType, formatRG);
    const divergence = createFBO(gl, simWidth, simHeight, halfFloatTexType, formatR);
    const curl = createFBO(gl, simWidth, simHeight, halfFloatTexType, formatR);
    const pressure = createDoubleFBO(gl, simWidth, simHeight, halfFloatTexType, formatR);

    const texelSizeX = 1.0 / simWidth;
    const texelSizeY = 1.0 / simHeight;
    const texelSize = [texelSizeX, texelSizeY];

    // Helper function to render
    function blit(destination: WebGLFramebuffer | null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function resizeCanvas() {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    }

    // Mouse interaction variables
    let mouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let colorCounter = 0;

    function handleMouseDown(e: MouseEvent) {
      mouseDown = true;
      lastMouseX = e.offsetX;
      lastMouseY = e.offsetY;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!mouseDown) return;
      
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      
      const velocity = { x: dx * SPLAT_FORCE, y: -dy * SPLAT_FORCE };
      
      // Generate color based on counter
      colorCounter = (colorCounter + COLOR_UPDATE_SPEED / 100) % 360;
      const color = hslToRgb(colorCounter, 0.7, 0.5);
      
      // Add splat at current mouse position
      addSplat(mouseX, mouseY, velocity.x, velocity.y, color);
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }

    function handleMouseUp() {
      mouseDown = false;
    }

    // Color conversion utility
    function hslToRgb(h: number, s: number, l: number) {
      h = h % 360;
      h /= 360;
      
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      return { r, g, b };
    }

    // WebGL operations
    function addSplat(x: number, y: number, dx: number, dy: number, color: { r: number, g: number, b: number }) {
      splatProgram.bind();
      
      gl.uniform1i(splatProgram.uniforms.uTarget, 0);
      gl.uniform1f(splatProgram.uniforms.uAspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.uPoint, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.uColor, color.r, color.g, color.b);
      gl.uniform1f(splatProgram.uniforms.uRadius, SPLAT_RADIUS);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.viewport(0, 0, dyeWidth, dyeHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      density.swap();
      
      gl.uniform1i(splatProgram.uniforms.uTarget, 0);
      gl.uniform3f(splatProgram.uniforms.uColor, dx, dy, 0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.viewport(0, 0, simWidth, simHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      velocity.swap();
    }

    // Main rendering loop
    let lastTime = Date.now();
    
    function update() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      
      resizeCanvas();
      
      // Step 1: Advect velocity and density
      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, texelSize[0], texelSize[1]);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, 0);
      gl.uniform1i(advectionProgram.uniforms.uSource, 0);
      gl.uniform1f(advectionProgram.uniforms.uDeltaT, dt);
      gl.uniform1f(advectionProgram.uniforms.uDissipation, VELOCITY_DISSIPATION);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, simWidth, simHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      velocity.swap();
      
      gl.uniform1i(advectionProgram.uniforms.uVelocity, 0);
      gl.uniform1i(advectionProgram.uniforms.uSource, 1);
      gl.uniform1f(advectionProgram.uniforms.uDissipation, DENSITY_DISSIPATION);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, dyeWidth, dyeHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      density.swap();
      
      // Display result
      gl.viewport(0, 0, canvas.width, canvas.height);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.uTexture, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      requestAnimationFrame(update);
    }
    
    // Set up event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    update();
    
    // Clean up
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT
  ]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default SplashCursor;
