
import { SplashCursorConfig } from './types';

export const defaultSplashCursorConfig: SplashCursorConfig = {
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
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  TRANSPARENT: false,
};
