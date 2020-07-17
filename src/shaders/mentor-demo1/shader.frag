// Writing a little shader in vim
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D testPattern;
uniform sampler2D noise;

void main() {

  vec2 uv = gl_FragCoord.xy/resolution.xy;

  vec3 color = vec3(uv.x);

  vec4 noiseColor = texture2D(noise, uv + time*.0001);
  vec4 texColor = texture2D(testPattern, uv + noiseColor.rg*0.1);

        //  R   G   B   A
  gl_FragColor = texColor;
}
