import { Shader } from './Shader.jsx';
import { h, render } from 'preact';

require('../css/main.scss');


render((
  <div id={`app`}>
    <Shader name={`perlin-cloudfield`} />
    <Shader name={`gooey-colors`} />
    <Shader name={`stripey`} />
    <Shader name={`uv-helloworld`} />
  </div>
), document.body);
