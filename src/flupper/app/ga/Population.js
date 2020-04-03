import Config from "../app_config";
import Flupper from "./Flupper";

export default class Population {
  constructor(p5) {
    this.p = p5;
    this.fluppers = [];
    this.deadCount = 0;
    this.isAllDead = false;
    this.initFluppers();

    //ga
    this.bestFlupper = null;
    this.bestFitness = 0;
    this.bestFlupperTillNow = null;
    this.bestFitnessTillNow = 0;
    this.matingPool = [];
    this.generation = 0;
  }

  initFluppers = () => {
    for (let i = 0; i < Config.popSize; i++) this.fluppers.push(new Flupper(this.p));
  };

  //========================================p5=====================================//
  showFluppers = (pipes, score) => {
    this.deadCount = 0;
    this.fluppers.forEach(flupper => {
      flupper.update(pipes, score);
      flupper.think();
      flupper.show();
      this.deadCount += (flupper.isDead) ? 1 : 0
    });

    if (this.deadCount === Config.popSize) this.isAllDead = true;
  };

  //=====================================ga====================================//
  nextGeneration = () => {
    this.calcFitness();
    this.normalizeFitness();
    this.generateMatingPool();
    this.generateNextGen();
  };

  calcFitness = () => {
    this.bestFitness = 0;
    this.fluppers.forEach(flupper => {
      let fitness = flupper.calcFitness();
      if (fitness > this.bestFitness) {
        this.bestFitness = fitness;
        this.bestFlupper = flupper;
      }
    });

    //TODO: Add logic to write best Neural Network weight to a JSON file.
    if (this.bestFitness >= this.bestFitnessTillNow) {
      this.bestFitnessTillNow = this.bestFitness;
      this.bestFlupperTillNow = this.bestFlupper;
    }
  };

  normalizeFitness = () => this.fluppers.forEach(flupper => flupper.fitness /= this.bestFitness);

  generateMatingPool = () => {
    this.fluppers.forEach(flupper => {
      let n = flupper.fitness * 500;
      for (let i = 0; i < n; i++) {
        this.matingPool.push(flupper);
      }
    })
  };

  generateNextGen = () => {
    let fluppers = [];
    for (let i = 0; i < Config.popSize; i++) {
      let pickedBrain = this.p.random(this.matingPool).brain;
      pickedBrain.mutate();
      fluppers.push(new Flupper(this.p, pickedBrain));
    }
    this.fluppers = fluppers;
    this.generation += 1;
    this.isAllDead = false;
  };
}