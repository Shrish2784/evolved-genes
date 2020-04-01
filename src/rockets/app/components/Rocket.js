import React from "react";
import P5Wrapper from "react-p5-wrapper";
import Sketch from "../p5/sketch";
import {Container} from "react-bootstrap";

export default class Rocket extends React.Component {
  render() {
    return (
      <Container>
        <Container id="rocketContainer" className="text-center my-3">
          <P5Wrapper sketch={Sketch}/>
        </Container>
      </Container>
    );
  }
}