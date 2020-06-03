// Writing a little shader in vim
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D noise;
uniform sampler2D gradient;
uniform float u1;
uniform float u2;
uniform float u3;
// uniform sampler2D fbo;

void main() {
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  vec2 ouv = (uv-.5)*2.;
  ouv.x *= resolution.x/resolution.y;

  uv.x *= resolution.x/resolution.y;
  uv *= u2;

  float tt = time * u3;

  vec4 t = texture2D(noise, vec2(uv.y-tt*.000024, uv.x+tt*.00001));
  vec4 t2 = texture2D(noise, vec2(tt*-.0002+t.g, t.r));
  vec4 t3 = texture2D(gradient, vec2(.2,0.)+(t2.rg*2.5)-.8);

  float m = distance(ouv, vec2(0.,0.));

  gl_FragColor = vec4(
    t3.rgb+(m*u1),
    1.
  );
}
