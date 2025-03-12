
import { addSplat } from './fluidSimulation';
import { hslToRgb } from './colorUtils';
import { Program } from './webglUtils';
import { WebGLContext } from './types';

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
  SPLAT_FORCE: number,
  COLOR_UPDATE_SPEED: number,
  SPLAT_RADIUS: number,
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
  
  const velocityForce = { x: dx * SPLAT_FORCE, y: -dy * SPLAT_FORCE };
  
  // Generate color based on counter
  mouseState.colorCounter = (mouseState.colorCounter + COLOR_UPDATE_SPEED / 100) % 360;
  const color = hslToRgb(mouseState.colorCounter, 0.7, 0.5);
  
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
    SPLAT_RADIUS,
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
