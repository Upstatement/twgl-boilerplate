import { Component, h } from "preact";
import { TwglScene } from "./TwglScene.jsx";

import Desktop from "../assets/images/desktop.png";

export class Shader extends Component {
  render({ name, playing }) {
    let time = new Date().toLocaleTimeString();
    const frag = require(`./shaders/${name}/shader.frag`);
    const vert = require(`./shaders/${name}/shader.vert`);

    return (
      <div className={`shader ${playing ? "playing" : ""}`}>
        <img src={Desktop} />

        <TwglScene frag={frag} vert={vert} playing={playing} />
      </div>
    );
  }
}
