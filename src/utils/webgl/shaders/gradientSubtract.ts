
export const gradientSubtractShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float B = texture2D(uPressure, vB).x;
      float T = texture2D(uPressure, vT).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= 0.5 * vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;
