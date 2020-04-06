import React from "react";
import {Container} from "react-bootstrap";
import P5Wrapper from "react-p5-wrapper";
import Sketch from "../p5/sketch";

export default class Tetris extends React.Component {
  render() {
    return (
      <Container>
        <Container className="text-center my-3">
          <P5Wrapper sketch={Sketch}/>
        </Container>
      </Container>
    );
  }
}