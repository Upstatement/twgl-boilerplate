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
const vec3 bg = vec3(1.);

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 vUv = (uv * 2.) - 1.;
  vec2 vMp = (mousePos * 2.) - 1.;

  vec4 n1 = texture2D(noise, uv + vec2(time*.00001, 0.));
  vec4 n2 = texture2D(noise, n1.rg + vec2(-time*.00004, 0.0));
  float wn = (rand(vUv+fract(time))-.5)*.07;

  vec4 gc = texture2D(gradient, (time*.00005)+uv.yx+n2.rg*.3);
  // vec4 fb = texture2D(fbo, uv + vMp.x);
  float d = distance(vec2(.5), vUv*sceneScale) - n2.r*.4;
  // d *= n2.r;


  vec3 c = mix(gc.rgb, bg, d);
  gl_FragColor = vec4(c.rgb+wn, 1.);
}
