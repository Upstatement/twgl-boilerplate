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
uniform float u1;
uniform float u2;
uniform float u3;


const float sceneScale = 1.;
const vec3 bg = vec3(1.);

void main() {
  float tt = time * u1 *.5;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 vUv = (uv * 2.) - 1.;
  vec2 vMp = (mousePos * 2.) - 1.;

  vec4 n1 = texture2D(noise, uv + vec2(tt*.0001, tt*.000027));
  vec4 n2 = texture2D(noise, .25 * n1.rg + vec2(-tt*.0004, 0.0));

  vec4 gc = texture2D(gradient, uv.yx+n2.rg);
  // vec4 fb = texture2D(fbo, uv + vMp.x);
  float d = distance(vec2(0.), vUv);
  // d *= n2.r;

  vec3 c = mix(gc.rgb, bg, pow(d*u3*2., 2.));
  gl_FragColor = vec4(c, 1.);
}
