
export interface WebGLContext extends WebGLRenderingContext {
  R16F?: number;
  RG16F?: number;
  RGBA16F?: number;
  RG?: number;
  RED?: number;
}

export interface SplashCursorConfig {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  CAPTURE_RESOLUTION: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  SHADING: boolean;
  COLOR_UPDATE_SPEED: number;
  BACK_COLOR: { r: number; g: number; b: number };
  TRANSPARENT: boolean;
}

export interface WebGLProps {
  gl: WebGLContext;
  ext: {
    formatRGBA: { internalFormat: number; format: number };
    formatRG: { internalFormat: number; format: number };
    formatR: { internalFormat: number; format: number };
    halfFloatTexType: number;
    supportLinearFiltering: boolean;
  };
}
