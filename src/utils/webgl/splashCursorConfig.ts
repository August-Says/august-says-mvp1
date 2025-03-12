
import { SplashCursorConfig } from './types';

export const defaultSplashCursorConfig: SplashCursorConfig = {
  // Simulation settings
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 0.98,
  VELOCITY_DISSIPATION: 0.98,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 30,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLOR_UPDATE_SPEED: 10,
  
  // Color settings
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  SPLASH_COLORS: [
    { r: 0.8, g: 0.2, b: 0.8 }, // Purple
    { r: 0.2, g: 0.8, b: 0.8 }, // Cyan
    { r: 0.9, g: 0.4, b: 0.1 }, // Orange
    { r: 0.4, g: 0.8, b: 0.4 }, // Green
  ],
  COLOR_MODE: 'rainbow',
  TRANSPARENT: false,
  
  // Effect settings
  BLUR_ENABLED: true,
  BLUR_ITERATIONS: 2,
  GLOW_ENABLED: true,
  GLOW_INTENSITY: 0.5,
};

