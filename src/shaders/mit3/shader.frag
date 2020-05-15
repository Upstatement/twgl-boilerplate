// Writing a little shader in vim
precision mediump float;
//
uniform vec2 resolution;
uniform float time;
uniform vec2 mousePos;
uniform vec2 mouseVel;
uniform sampler2D noise;
uniform sampler2D gradient;
uniform sampler2D whitenoise;
uniform sampler2D fbo;

const float sceneScale = 1.;
const vec3 bg = vec3(1.);


void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 vUv = (uv * 2.) - 1.;
  vec2 vMp = (mousePos * 2.) - 1.;

  vec4 n1 = texture2D(noise, uv + vec2(time*.00001, 0.));
  vec4 n2 = texture2D(noise, n1.rg + vec2(-time*.00004, 0.0));
  vec4 wn = texture2D(whitenoise, uv+time*.00005);
  vec4 wn2 = texture2D(whitenoise, 8.*uv+wn.bg);
  float wnm = dot(wn2.rgb, vec3(0.299, 0.587, 0.114));

  vec4 gc = texture2D(gradient, vec2(wnm, 0.) + n1.rg);

  vec4 gcc = texture2D(gradient, n2.rg);

  vec4 fc = mix(gc, gcc, n1.r);

  float d = 1.2 - distance(vec2(.5), vUv);


  vec3 c = mix(fc.rgb, bg, 1. - d);
  gl_FragColor = vec4(c, 1.);
}
