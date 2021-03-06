import Config from "./../app_config";
import DNA from "./DNA";
import {Vector} from "p5";

export default class Rocket {
  constructor(p5, id, makeDna = true) {
    this.p = p5;
    this.position = this.p.createVector(Config.p5.canvasWidth / 2, Config.p5.canvasHeight);
    this.velocity = this.p.createVector();
    this.accel = this.p.createVector();
    this.fitness = 0;
    this.fitnessRatio = 0;
    this.isCrashed = false;
    this.dna = new DNA(makeDna);
  }

  /**
   * Fitness Function of the Rocket.
   *
   * The closer is the Rocket to the Goal, the higher fitness it has.
   * @param goalX
   * @param goalY
   * @returns {number}
   */
  calcFitness = (goalX, goalY) => {
    let d = this.p.dist(this.position.x, this.position.y, goalX, goalY);
    let max = Config.p5.canvasWidth;
    this.d = (d >= max) ? max : d;
    this.fitness = this.p.map(d, 0, max, max, 0);
    this.calibrateFitness();
    return this.fitness;
  };

  /**
   * Further Reinforcements for the Rockets.
   */
  calibrateFitness = () => {
    let d = this.d;

    if (this.isCrashed) {
      this.fitness *= 0.1;
    } else {
      //POSITIVE REINFORCEMENTS
      if (d <= 1) this.fitness *= 1000;
      else if (d <= 10) this.fitness *= 100;
      else if (d <= 20) this.fitness *= 10;
      else if (d <= 30) this.fitness *= 8;
      else if (d <= 50) this.fitness *= 5;
      else if (d <= 100) this.fitness *= 3;
      //NEGATIVE REINFORCEMENTS
      else if (d >= 500) this.fitness *= .2;
      else if (d >= 400) this.fitness *= .5;
      else if (d >= 300) this.fitness *= .7;
      else if (d >= 200) this.fitness *= .8;
    }
  };

  /**
   * Mutation involves randomly changing a thruster.
   */
  mutate = () => {
    if (Math.random() <= Config.mutationRate)
      this.dna.forces[Math.floor(Math.random() * Config.lifespan)] = Vector.random2D().setMag(Config.maxForce);
  };

  /**
   * Thruster's force is applied to the Acceleration of the Rocket.
   * @param count
   */
  applyForce = (count) => {
    this.accel.add(this.dna.forces[count]);
  };

  /**
   * Simple Physics to alter the Rocket.
   */
  update = () => {
    if (!this.isCrashed) {
      this.velocity.add(this.accel);
      this.position.add(this.velocity);
      this.accel.mult(0);
      this.velocity.limit(Config.velLimit);
    }
  };

  /**
   * Mark the Rocket as crashed if it has come in contact with
   * the obstacle.
   *
   * @param obstacle
   */
  checkCrash = (obstacle) => {
    let x = this.position.x;
    let y = this.position.y;

    if (x >= obstacle.x && x <= obstacle.x + obstacle.w && y >= obstacle.y && y <= obstacle.y + obstacle.h)
      this.isCrashed = true;
  };

  /**
   * Show the Rocket on the Canvas.
   *
   * @param color
   * @param thrusterColor
   */
  show = (color = Config.p5.rocketColor, thrusterColor = Config.p5.thrusterColor) => {
    let rW = Config.p5.rocketWidth;
    let rH = Config.p5.rocketHeight;
    let tH = Config.p5.thrusterHeight;

    this.p.push();

    //Rocket
    this.p.fill(color);
    this.p.noStroke();
    this.p.translate(this.position.x, this.position.y);
    this.p.rotate(this.velocity.heading());
    this.p.rectMode(this.p.CENTER);
    this.p.ellipse(0, 0, rW, rH);

    //Thrusters
    if (this.isCrashed) thrusterColor = Config.p5.crashedThrusterColor;
    this.p.stroke(thrusterColor);
    this.p.strokeWeight(Config.p5.thrusterWidth);
    this.p.line(-(rW / 2), -(rH / 2), -(rW / 2 + tH), -(rH / 2));
    this.p.line(-(rW / 2), rH / 2, -(rW / 2 + tH), rH / 2);
    // this.p.ellipse(-25, 0, 5, 5);
    this.p.pop();
  }

}