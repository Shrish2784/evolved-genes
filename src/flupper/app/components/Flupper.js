import React from "react";
import {Container} from "react-bootstrap";
import P5Wrapper from "react-p5-wrapper";
import Sketch from "../p5/sketch";
import "../flupper.css";

export default class Flupper extends React.Component {
  render() {
    return (
      <Container id="flupperApp">
        <Container className="text-center my-3">
          <P5Wrapper sketch={Sketch}/>
        </Container>
      </Container>
    );
  }
}