import Config from "../app_config";
import Brain from "../nn/Brain";

export default class Flupper {
  constructor(p5, brain = null) {
    //p5
    this.p = p5;
    this.x = Config.p5.flupper.x;
    this.y = Config.p5.flupper.y;
    this.v = 0;

    //nn
    this.brain = (brain) ? brain : new Brain();
    this.isDead = false;
    this.cPipe = null;

    //ga
    this.fitness = 0;
    this.frames = 0;
    this.score = 0;
  }

  //===========================GA=======================================//

  calcFitness = () => {
    this.frames += (1000 * this.score);
    this.fitness = this.frames;
    return this.fitness;
  };


  //===========================NN=======================================//

  think = () => {
    let cH = Config.p5.canvasHeight;
    let distToTop = this.y - this.cPipe.top * cH;
    let distToBottom = this.y - (cH - (this.cPipe.bottom * cH));

    let result = this.brain.activate([
      this.v,
      this.cPipe.x - this.x,
      distToTop,
      distToBottom
    ]);

    if (result[0] > 0.5) this.flap();
  };

  //============================P5======================================//

  update = (pipes, score) => {
    this.v += Config.gravity;
    this.y += this.v;
    this.v *= Config.resist;

    //Boundaries of canvas
    if (this.y > Config.p5.canvasHeight) {
      this.y = Config.p5.canvasHeight;
      this.v = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.v = 0;
    }

    //Dead
    for (let i = 0; i < pipes.length; i++)
      if (pipes[i].isBehindFlupper) {
        this.cPipe = pipes[i + 1];
        break
      }

    if (!this.cPipe) this.cPipe = pipes[0];

    if (this.x >= this.cPipe.x &&
      this.x <= (this.cPipe.x + this.cPipe.pConf.width) && (
        this.y <= (this.cPipe.top * this.cPipe.cH) ||
        this.y >= (this.cPipe.cH - (this.cPipe.bottom * this.cPipe.cH))
      )
    ) {
      this.isDead = true;
    }

    //GA
    if (!this.isDead) {
      this.frames += 1;
      this.score = score;
    }
  };

  flap = () => this.v -= (this.isDead) ? 0 : Config.flap;

  show = () => {
    if (!this.isDead) {
      let p = this.p;
      let bConf = Config.p5.flupper;
      p.push();
      p.noStroke();
      p.translate(bConf.x, this.y);
      p.fill(bConf.color);
      p.ellipse(0, 0, bConf.width, bConf.height);
      p.pop();
    }
  }
}