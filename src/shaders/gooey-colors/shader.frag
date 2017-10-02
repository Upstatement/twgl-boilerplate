precision mediump float;
//
uniform vec2 resolution;
uniform float time;
//
// void main() {
//   vec2 uv = gl_FragCoord.xy / resolution;
//   float color = 0.0;
//   // lifted from glslsandbox.com
//   color += sin( uv.x * cos( time / 3.0 ) * 60.0 ) + cos( uv.y * cos( time / 2.80 ) * 10.0 );
//   color += sin( uv.y * sin( time / 2.0 ) * 40.0 ) + cos( uv.x * sin( time / 1.70 ) * 40.0 );
//   color += sin( uv.x * sin( time / 1.0 ) * 10.0 ) + sin( uv.y * sin( time / 3.50 ) * 80.0 );
//   color *= sin( time / 10.0 ) * 0.5;
//
//   gl_FragColor = vec4( vec3( color * 0.5, sin( color + time / 2.5 ) * 0.75, color ), 1.0 );
// }

void main() {
  float ts = time * .0005;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x / resolution.y;
  
  gl_FragColor = vec4(.5 * (sin(2.*ts+uv.x*1.3) + 1.), .5 * (sin(.9*-ts+uv.x*1.4) + 1.), .5 * (sin(1.5*ts+uv.x+uv.y) + 1.), 1.);// mandelbrot(gl_FragCoord.xy);
}
