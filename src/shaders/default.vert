#version 300 es
precision mediump float;
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
in vec2 position;
in vec3 color;
in float idx;

out vec3 v_color;
out vec2 v_pos;

uniform float u_time;

void main() {
  // v_color = hsl2rgb(sin(.1*u_time+idx*3.1415*.5), .5, .55);


  float n = snoise2(position + u_time * 1.1 + position.x);
  float n2 = snoise2(position - u_time * .5 + (position.y*5.));
  v_color = color + vec3(n, n2, 1.);
  gl_PointSize = 1. + (1. - (n2 * n) * 16.);
  // gl_Position = vec4(position, 0., 1.);
  gl_Position = vec4(position.x, (position.y*0.) + (n-n2) * .1, 0., 1.0);
  v_pos = gl_Position.xy;
}
