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
import { WebGLContext, SplashCursorConfig } from '../utils/webgl/types';
import { defaultSplashCursorConfig } from '../utils/webgl/splashCursorConfig';
import { 
  setupVertexArray,
  stepSimulation
} from '../utils/webgl/fluidSimulation';
import {
  createMouseState,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
} from '../utils/webgl/splashCursorEvents';

function SplashCursor(props: Partial<SplashCursorConfig>) {
  const config: SplashCursorConfig = { ...defaultSplashCursorConfig, ...props };
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
    const formatRGBA = {
      internalFormat: gl.RGBA16F || gl.RGBA,
      format: gl.RGBA
    };
    
    const formatRG = {
      internalFormat: gl.RG16F || gl.RGBA,
      format: gl.RG || gl.RGBA
    };
    
    const formatR = {
      internalFormat: gl.R16F || gl.RGBA,
      format: gl.RED || gl.RGBA
    };
    
    const halfFloatTexType = gl.HALF_FLOAT || gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES || gl.UNSIGNED_BYTE;
    const supportLinearFiltering = gl.getExtension('OES_texture_float_linear') != null;

    // Set up canvas background
    gl.clearColor(
      config.BACK_COLOR.r, 
      config.BACK_COLOR.g, 
      config.BACK_COLOR.b, 
      config.TRANSPARENT ? 0 : 1
    );
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set up WebGL
    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    
    // Setup vertex array
    const vertexArray = setupVertexArray(gl);
    
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Set simulation dimensions
    let simWidth = config.SIM_RESOLUTION;
    let simHeight = config.SIM_RESOLUTION;
    let dyeWidth = config.DYE_RESOLUTION;
    let dyeHeight = config.DYE_RESOLUTION;

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, baseVertexShader);
    const displayShader = compileShader(
      gl, 
      gl.FRAGMENT_SHADER, 
      displayShaderSource, 
      config.SHADING ? ['SHADING'] : []
    );
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

    // Resize canvas function
    function resizeCanvas() {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    }

    // Mouse interaction state
    const mouseState = createMouseState();

    // Create event handler functions bound to this context
    const handleMouseMoveBound = (e: MouseEvent) => handleMouseMove(
      e, 
      mouseState, 
      gl, 
      splatProgram, 
      canvas, 
      density, 
      velocity, 
      config,
      dyeWidth,
      dyeHeight,
      simWidth,
      simHeight
    );

    // Main rendering loop
    let lastTime = Date.now();
    
    function update() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      
      resizeCanvas();
      
      // Run simulation step
      stepSimulation(
        gl,
        advectionProgram,
        displayProgram,
        velocity,
        density,
        dt,
        texelSize,
        dyeWidth,
        dyeHeight,
        simWidth,
        simHeight,
        config.VELOCITY_DISSIPATION,
        config.DENSITY_DISSIPATION,
        canvas
      );
      
      requestAnimationFrame(update);
    }
    
    // Set up event listeners
    canvas.addEventListener('mousedown', handleMouseDownBound);
    canvas.addEventListener('mousemove', handleMouseMoveBound);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    update();
    
    // Clean up
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDownBound);
      canvas.removeEventListener('mousemove', handleMouseMoveBound);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [
    props.SIM_RESOLUTION,
    props.DYE_RESOLUTION,
    props.DENSITY_DISSIPATION,
    props.VELOCITY_DISSIPATION,
    props.SPLAT_RADIUS,
    props.SPLAT_FORCE,
    props.SHADING,
    props.COLOR_UPDATE_SPEED,
    props.BACK_COLOR,
    props.SPLASH_COLORS,
    props.COLOR_MODE,
    props.TRANSPARENT,
    props.BLUR_ENABLED,
    props.BLUR_ITERATIONS,
    props.GLOW_ENABLED,
    props.GLOW_INTENSITY
  ]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default SplashCursor;
