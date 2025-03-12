
export const pressureShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float B = texture2D(uPressure, vB).x;
      float T = texture2D(uPressure, vT).x;
      float D = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - D) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;
