import React from "react";
import {Button, Container} from "react-bootstrap";
import Sketch, {Genetics} from "../ga/Genetics";
import P5Wrapper from "react-p5-wrapper";

export default class Writer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target: null,
      targetInputDisabled: false,
      genetics: null
    };
  }

  stopButton = (e) => {
    e.preventDefault();
    Genetics.reset();

    this.setState({
      target: null,
      targetInputDisabled: false,
      genetics: null
    })
  };

  inputSubmit = (e) => {
    e.preventDefault();
    let target = e.target.target.value;
    let targetInputDisabled = true;

    if (target.length > 100 || target.match(/^[A-Za-z0-9 ]+$/) === null) {
      document.getElementById("error").classList.remove("d-none");
      targetInputDisabled = false;
    } else {
      document.getElementById("error").classList.add("d-none");
      Genetics.init(target);
    }

    this.setState({
      ...this.state,
      target: target,
      targetInputDisabled: targetInputDisabled,
    });
  };

  render() {
    return (
      <Container>
        <div className="text-center my-3">
          <form onSubmit={(e) => this.inputSubmit(e)}>
            <input
              type="text"
              className="evolve-input"
              name="target"
              placeholder="target"
              disabled={this.state.targetInputDisabled}
            />
          </form>
        </div>

        <div id="error" className="alert-danger text-center my-3 p-3 w-50 m-auto d-none">
          The input target is not Valid.
          <div className="pt-2 text-left">
            <ul>
              <li>Should not contain any Special Character.</li>
              <li>Length should be below 100.</li>
            </ul>
          </div>
        </div>

        <Container className="my-3 text-center">
          <P5Wrapper sketch={Sketch}/>
          <Button className="btn mx-2"
                  onClick={() => {
                    Genetics.loop = !Genetics.loop
                  }}
                  disabled={!this.state.targetInputDisabled}>
            Pause/Play
          </Button>
          <Button className="btn-danger mx-2"
                  onClick={this.stopButton}
                  disabled={!this.state.targetInputDisabled}>
            Stop
          </Button>
        </Container>
      </Container>
    );
  }
}