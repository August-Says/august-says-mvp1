
export interface MaterialUniforms {
  [key: string]: WebGLUniformLocation;
}

export interface MaterialClass {
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  programs: { [key: number]: WebGLProgram };
  activeProgram: WebGLProgram | null;
  uniforms: MaterialUniforms;
  setKeywords: (keywords: string[]) => void;
  bind: () => void;
}

export interface ProgramClass {
  uniforms: { [key: string]: WebGLUniformLocation };
  program: WebGLProgram;
  bind: () => void;
}

export interface Color {
  r: number;
  g: number;
  b: number;
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
