import twgl from 'twgl.js';
import { Component, h } from 'preact';

export class TwglScene extends Component {

  constructor(props) {
    super();
    // set initial time:
    this.state = {
      time: Date.now(),
      playing: false,
    };
    this.uniforms = props.uniforms;
		this.count = 0;
    this.glRender = this.glRender.bind(this);
  }

  componentDidMount() {

    const canvas = this.el;

    this.gl = canvas.getContext("webgl");
    this.programInfo = twgl.createProgramInfo(this.gl, [this.vertShader, this.fragShader]);

		this.rectProgramInfo = twgl.createProgramInfo(this.gl, [require('./shaders/rect.vert'), require('./shaders/rect.frag')]);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const WHITE_NOISE_SIZE = Math.pow(128,2)

    const boxSize = 1.;

    const arrays = {
      position: [-boxSize, -boxSize, 0, boxSize, -boxSize, 0, -boxSize, boxSize, 0, -boxSize, boxSize, 0, boxSize, -boxSize, 0, boxSize, boxSize, 0],
    };
    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, arrays);

		this.fbos = [];

		this.fbos.push(twgl.createFramebufferInfo(this.gl));
		this.fbos.push(twgl.createFramebufferInfo(this.gl));

    this.textures = twgl.createTextures(this.gl, {
      noise: {
        src: 'assets/textures/noise256.png',
        mag: this.gl.LINEAR,
        min: this.gl.LINEAR,
      },
      testPattern: {
        src: 'assets/textures/test-pattern.jpg',
        mag: this.gl.LINEAR,
        min: this.gl.LINEAR,
      },
      gradient: {
        src: 'assets/textures/mit-grad.png',
        mag: this.gl.LINEAR,
        min: this.gl.LINEAR,
      },
      whitenoise: {
        mag: this.gl.NEAREST,
        min: this.gl.LINEAR,
        src: (() => {
          let a = [];
          for(let i = 0; i < WHITE_NOISE_SIZE; i++) {
            a.push(Math.floor(Math.random()*256));
          }
          return a
        })()
      },
    }, () => this.glRender(1.));

		this.mousePos = [0,0];
		this.mouseVel = [0,0];
    this.newPos = [0,0];
		window.addEventListener('mousemove', this.handleMouseMove.bind(this));
	}
	handleMouseMove(e) {
		this.newPos = [ e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
	}
  handleMouseOver() {
    this.setState({ playing: true });
    requestAnimationFrame(this.glRender);
  }

  handleMouseOut() {
    this.setState({ playing: false });
  }

  glRender(time) {
		if(this.fbos[0] === undefined) {
			requestAnimationFrame(this.glRender);
			return;
		}
    [0,1].map( i => {
      this.mouseVel[i] = (this.newPos[i] - this.mousePos[i]) * -1;
      this.mousePos[i] += (this.newPos[i] - this.mousePos[i]) * .005;
    });
    let width = this.el.width;
    let height = this.el.height;
    this.gl.viewport(0, 0, width, height);
		this.count += 1;
    const uniforms = {
      time: time,
      resolution: [width, height],
      noise: this.textures.noise,
      whitenoise: this.textures.whitenoise,
      gradient: this.textures.gradient,
      testPattern: this.textures.testPattern,
			mousePos: this.mousePos,
			mouseVel: this.mouseVel,
      u1: this.uniforms.u1,
      u2: this.uniforms.u2,
      u3: this.uniforms.u3,
    };
		//console.log(this.mousePos);
		// determine if this is an odd or even frame and arrange
		// buffers accordingly
		const i = this.count % 2;
		// mount the opposite FBO to a uniform texture
		uniforms.fbo = this.fbos[Math.floor(!i)].attachments[0];
		// target the current fbo
		twgl.bindFramebufferInfo(this.gl, this.fbos[i]);
    this.gl.useProgram(this.programInfo.program);
		// render the scene out to the target buffer
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    twgl.setUniforms(this.programInfo, uniforms);
    twgl.drawBufferInfo(this.gl, this.bufferInfo);


		uniforms.fbi = this.fbos[i].attachments[0];

		twgl.bindFramebufferInfo(this.gl);
    this.gl.useProgram(this.rectProgramInfo.program);
    twgl.setBuffersAndAttributes(this.gl, this.rectProgramInfo, this.bufferInfo);
    twgl.setUniforms(this.rectProgramInfo, uniforms);
    twgl.drawBufferInfo(this.gl, this.bufferInfo);

		//twgl.bindFramebufferInfo(this.gl, this.fbi);
		//twgl.drawBufferInfo(this.gl, this.bufferInfo);

    if(this.state.playing) {
      requestAnimationFrame(this.glRender);
    }
  }

	render({ frag, vert, playing, uniforms }) {
    if(this.state.playing !== playing) {
      this.state.playing = playing;
      this.uniforms = uniforms;
      requestAnimationFrame(this.glRender);
    }

		return (<div><canvas ref={(canvas) => { this.el = canvas; this.fragShader = frag; this.vertShader = vert; }}/></div>);
	}

}
