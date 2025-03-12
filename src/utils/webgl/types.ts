
export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface WebGLContext extends WebGLRenderingContext {
  R16F?: number;
  RG16F?: number;
  RGBA16F?: number;
  RG?: number;
  RED?: number;
  HALF_FLOAT?: number;
}

export interface ExtensionFormats {
  internalFormat: number;
  format: number;
}

export interface ShaderUniforms {
  [key: string]: WebGLUniformLocation | null;
  uTarget?: WebGLUniformLocation | null;
  uVelocity?: WebGLUniformLocation | null;
  uSource?: WebGLUniformLocation | null;
  uDeltaT?: WebGLUniformLocation | null;
  uDissipation?: WebGLUniformLocation | null;
  uPressure?: WebGLUniformLocation | null;
  uDivergence?: WebGLUniformLocation | null;
  uAspectRatio?: WebGLUniformLocation | null;
  uPoint?: WebGLUniformLocation | null;
  uColor?: WebGLUniformLocation | null;
  uRadius?: WebGLUniformLocation | null;
  uTexture?: WebGLUniformLocation | null;
  texelSize?: WebGLUniformLocation | null;
}

export interface WebGLProps {
  gl: WebGLContext;
  ext: {
    formatRGBA: ExtensionFormats;
    formatRG: ExtensionFormats;
    formatR: ExtensionFormats;
    halfFloatTexType: number;
    supportLinearFiltering: boolean;
  };
}

export interface FrameBuffer {
  texture: WebGLTexture | null;
  fbo: WebGLFramebuffer | null;
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
  BACK_COLOR: Color;
  TRANSPARENT: boolean;
}

