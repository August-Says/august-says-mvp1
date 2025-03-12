
export const splatShaderSource = `
  precision highp float;
  uniform sampler2D uTarget;
  uniform float uAspectRatio;
  uniform vec2 uPoint;
  uniform vec3 uColor;
  uniform float uRadius;
  varying vec2 vUv;
  void main() {
      vec2 p = vUv - uPoint;
      p.x *= uAspectRatio;
      vec3 color = texture2D(uTarget, vUv).rgb;
      float dist = length(p);
      float radius = uRadius;
      if (dist < radius) {
          float alpha = smoothstep(radius, 0.0, dist);
          color += uColor * alpha;
      }
      gl_FragColor = vec4(color, 1.0);
  }
`;
