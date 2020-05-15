// Writing a little shader in vim
precision mediump float;
//
uniform vec2 resolution;
uniform float time;
uniform vec2 mousePos;
uniform vec2 mouseVel;
uniform sampler2D noise;
uniform sampler2D gradient;
uniform sampler2D fbo;

const float sceneScale = 1.;


void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 vUv = (uv * 2.) - 1.;
  vec2 vMp = (mousePos * 2.) - 1.;

  vec4 n1 = texture2D(noise, uv + vec2(time*.00001, 0.));
  vec4 n2 = texture2D(noise, n1.rg + vec2(-time*.00004, 0.0));

  vec4 gc = texture2D(gradient, uv.yx+n2.rg);

  float d = 1. - distance(vec2(.5), vUv*sceneScale);
  d *= n2.r;

  vec3 c = vec3(.5) - vec3((1. - gc.rgb) * d);
  gl_FragColor = vec4(c * 2., 1.);
}
