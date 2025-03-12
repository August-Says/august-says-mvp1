
export const baseVertexShader = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(texelSize.x, 0.0);
      vR = vUv + vec2(texelSize.x, 0.0);
      vT = vUv + vec2(0.0, texelSize.y);
      vB = vUv - vec2(0.0, texelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export const displayShaderSource = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform vec2 texelSize;

  vec3 linearToGamma (vec3 color) {
      color = max(color, vec3(0));
      return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
  }

  void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      
      #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;

          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);

          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);

          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
      #endif

      float a = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c, a);
  }
`;

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

export const divergenceShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float B = texture2D(uVelocity, vB).y;
      float T = texture2D(uVelocity, vT).y;
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

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
