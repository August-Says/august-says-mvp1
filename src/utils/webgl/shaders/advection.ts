
export const advectionShaderSource = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform float uDeltaT;
  uniform float uDissipation;
  varying vec2 vUv;
  void main() {
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      vec2 newUV = vUv - uDeltaT * velocity;
      newUV = clamp(newUV, 0.0, 1.0);
      vec4 sourceColor = texture2D(uSource, newUV);
      gl_FragColor = uDissipation * sourceColor;
  }
`;
