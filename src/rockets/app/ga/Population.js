import Config from "../app_config";
import Rocket from "./Rocket";

export default class Population {
  constructor(p5, goalX, goalY) {
    this.p = p5;
    this.goalX = goalX;
    this.goalY = goalY;
    this.rockets = [];
    this.matingPool = [];
    this.bestFit = 0;
    this.betterFit = 0;
    this.goodFit = 0;
    this.mostFit = {
      bestFit: null,
      betterFit: null,
      goodFit: null
    };
    this.generation = 0;
    this.initRockets();
  }

  initRockets = () => {
    for (let i = 0; i < Config.popSize; i++) {
      this.rockets.push(new Rocket(this.p, i + 1));
    }
  };

  showRockets = (count) => {
    this.rockets.forEach((rocket) => {
      rocket.applyForce(count);
      rocket.update();
      rocket.show();
    });
    if (this.mostFit.bestFit)
      this.mostFit.bestFit.show(Config.p5.bestRocketColor, Config.p5.prevRocketThrusterColor);
    if (this.mostFit.betterFit)
      this.mostFit.betterFit.show(Config.p5.betterRocketColor, Config.p5.prevRocketThrusterColor);
    if (this.mostFit.goodFit)
      this.mostFit.goodFit.show(Config.p5.goodRocketColor, Config.p5.prevRocketThrusterColor);

  };

  evolve = () => {
    this.calcFitness();
    this.setFitnessRatio();
    this.generateMatingPool();
    this.nextGeneration();
  };

  calcFitness = () => {
    this.bestFit = 0;
    this.betterFit = 0;
    this.goodFit = 0;

    this.rockets.forEach(rocket => {
      let fit = rocket.calcFitness(this.goalX, this.goalY);
      if (fit > this.bestFit) {
        this.bestFit = fit;
        this.mostFit.bestFit = rocket;
      } else if (fit > this.betterFit) {
        this.betterFit = fit;
        this.mostFit.betterFit = rocket;
      } else if (fit > this.goodFit) {
        this.goodFit = fit;
        this.mostFit.goodFit = rocket;
      }
    });
  };

  setFitnessRatio = () => this.rockets.forEach(rocket => rocket.fitnessRatio = rocket.fitness / this.bestFit);

  generateMatingPool = () => {
    this.rockets.forEach(rocket => {
      let n = rocket.fitnessRatio * 500;
      for (let i = 0; i < n; i++) {
        this.matingPool.push(rocket);
      }
    })
  };

  nextGeneration = () => {
    let rockets = [];
    for (let i = 0; i < Config.popSize; i++) rockets.push(this.crossover(this.selection(), this.selection(), i));
    this.rockets = rockets;
    this.generation += 1;
  };

  selection = () => this.p.random(this.matingPool);

  crossover = (rocket1, rocket2, id) => {
    let rocket = new Rocket(this.p, id, false);
    let point = Math.floor(Math.random() * Config.lifespan);
    for (let i = 0; i < Config.lifespan; i++) {
      if (i < point) rocket.dna.forces.push(rocket1.dna.forces[i]);
      else rocket.dna.forces.push(rocket2.dna.forces[i]);
    }
    rocket.mutate();
    return rocket;
  }
}