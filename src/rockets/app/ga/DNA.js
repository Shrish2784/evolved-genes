import Config from "../app_config";
import {Vector} from "p5";

export default class DNA {
  constructor(makeDna = true) {
    this.forces = [];
    if (makeDna) this.initForces();
  }

  initForces = () => {
    for (let i = 0; i < Config.lifespan; i++) this.forces.push(Vector.random2D().setMag(Config.maxForce));
  }
}