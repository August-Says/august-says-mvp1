
export const curlShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float B = texture2D(uVelocity, vB).x;
      float T = texture2D(uVelocity, vT).x;
      float curl = 0.5 * (T - B - R + L);
      gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
  }
`;
