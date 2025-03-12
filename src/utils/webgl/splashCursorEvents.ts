
import { addSplat } from './fluidSimulation';
import { hslToRgb } from './colorUtils';
import { Program } from './webglUtils';
import { WebGLContext, Color, SplashCursorConfig } from './types';

// Mouse interaction state
export interface MouseState {
  mouseDown: boolean;
  lastMouseX: number;
  lastMouseY: number;
  colorCounter: number;
}

// Initialize mouse state
export function createMouseState(): MouseState {
  return {
    mouseDown: false,
    lastMouseX: 0,
    lastMouseY: 0,
    colorCounter: 0
  };
}

// Event handler for mouse down
export function handleMouseDown(e: MouseEvent, mouseState: MouseState) {
  mouseState.mouseDown = true;
  mouseState.lastMouseX = e.offsetX;
  mouseState.lastMouseY = e.offsetY;
}

// Event handler for mouse move
export function handleMouseMove(
  e: MouseEvent, 
  mouseState: MouseState,
  gl: WebGLContext,
  splatProgram: Program,
  canvas: HTMLCanvasElement,
  density: any,
  velocity: any,
  config: SplashCursorConfig,
  dyeWidth: number,
  dyeHeight: number,
  simWidth: number,
  simHeight: number
) {
  if (!mouseState.mouseDown) return;
  
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  
  const dx = mouseX - mouseState.lastMouseX;
  const dy = mouseY - mouseState.lastMouseY;
  
  const velocityForce = { 
    x: dx * config.SPLAT_FORCE, 
    y: -dy * config.SPLAT_FORCE 
  };
  
  // Color selection based on mode
  let color: Color;
  switch (config.COLOR_MODE) {
    case 'single':
      color = config.SPLASH_COLORS[0];
      break;
    case 'custom':
      const colorIndex = Math.floor(Math.random() * config.SPLASH_COLORS.length);
      color = config.SPLASH_COLORS[colorIndex];
      break;
    case 'rainbow':
    default:
      mouseState.colorCounter = (mouseState.colorCounter + config.COLOR_UPDATE_SPEED / 100) % 360;
      color = hslToRgb(mouseState.colorCounter, 0.7, 0.5);
      break;
  }
  
  // Add splat at current mouse position
  addSplat(
    gl, 
    splatProgram, 
    canvas, 
    density, 
    velocity, 
    mouseX, 
    mouseY, 
    velocityForce.x, 
    velocityForce.y, 
    color,
    config.SPLAT_RADIUS,
    dyeWidth,
    dyeHeight,
    simWidth,
    simHeight
  );
  
  mouseState.lastMouseX = mouseX;
  mouseState.lastMouseY = mouseY;
}

// Event handler for mouse up
export function handleMouseUp(mouseState: MouseState) {
  mouseState.mouseDown = false;
}
