// Writing a little shader in vim
precision mediump float;
//
uniform vec2 resolution;
uniform float time;
uniform vec2 mousePos;
uniform vec2 mouseVel;

uniform sampler2D whitenoise;
uniform sampler2D noise;
uniform sampler2D gradient;
uniform sampler2D fbo;

const float sceneScale = 1.;
const vec3 bg = vec3(1.);

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float gs(vec4 color) {
	float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
	return gray;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 vUv = (uv * 2.) - 1.;
  vec2 vMp = (mousePos * 2.) - 1.;

  vec4 n1 = texture2D(noise, uv + vec2(time*.000001, 0.));
  vec4 n2 = texture2D(noise, n1.rg + vec2(-time*.00004, 0.0));

  float tt = time * .000025;
  float cc = gs(texture2D(whitenoise, vUv*4.-vec2(tt, 0.)));
  float cc2 = gs(texture2D(whitenoise, vUv*3.6+vec2(tt, 0.)));
  float sparkle = pow(cc2 * cc, 8.);

  vec4 gc = texture2D(gradient, (time*.0)+uv.yx+n2.rg*.3);
  float d = distance(vec2(.5), vUv*sceneScale) - n2.r*.4;

  vec3 c = mix(gc.rgb, bg, d);
  gl_FragColor = vec4(c.rgb*(1. + sparkle), 1.);
}
