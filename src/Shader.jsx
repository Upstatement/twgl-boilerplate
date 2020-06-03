import { Component, createRef, h } from 'preact';
import { TwglScene } from './TwglScene.jsx';
import * as dat from 'dat.gui'

export class Shader extends Component {

	componentWillMount() {
		this.ref = createRef();
		this.uniforms = {
			u1: 0.0,
			u2: 0.0,
			u3: 0.0
		}
	}

	componentDidMount() {
		const gui = new dat.GUI()
		gui.add(this.uniforms, 'u1', 0., 1.);
		gui.add(this.uniforms, 'u2', 0., 1.);
		gui.add(this.uniforms, 'u3', 0., 1.);
		gui.remember(this.uniforms);
		this.ref.current.appendChild(gui.domElement);
	}

	render({ name, playing }) {
    const frag = require(`./shaders/${name}/shader.frag`);
    const vert = require(`./shaders/${name}/shader.vert`);

		return (
      <div className={`shader ${playing ? 'playing' : ''}`}>
        <h2>{name}</h2>
        <TwglScene frag={frag} vert={vert} uniforms={this.uniforms} playing={playing} />
				<div className={`controls`} ref={this.ref}></div>
      </div>
    );
	}
}
