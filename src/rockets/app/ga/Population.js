import Config from "../app_config";
import Rocket from "./Rocket";

export default class Population {
  constructor(p5, goalX, goalY, obstacle) {
    this.p = p5;
    /**
     * Obstacle to avoid.
     */
    this.obstacle = obstacle;

    /**
     * Goal coordinates
     */
    this.goalX = goalX;
    this.goalY = goalY;

    /**
     * All the rockets.
     * @type {*[]}
     */
    this.rockets = [];
    this.matingPool = [];

    /**
     * Fit rockets.
     */
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

  /**
   * Initialize all the rockets.
   */
  initRockets = () => {
    for (let i = 0; i < Config.popSize; i++) {
      this.rockets.push(new Rocket(this.p, i + 1));
    }
  };

  /**
   * Display all the rockets on the Canvas.
   * @param count
   */
  showRockets = (count) => {
    this.rockets.forEach((rocket) => {
      rocket.applyForce(count);
      rocket.update();
      rocket.checkCrash(this.obstacle);
      rocket.show();
    });

    /**
     * Display the most fit rockets.
     */
    if (this.mostFit.bestFit)
      this.mostFit.bestFit.show(Config.p5.bestRocketColor, Config.p5.prevRocketThrusterColor);
    if (this.mostFit.betterFit)
      this.mostFit.betterFit.show(Config.p5.betterRocketColor, Config.p5.prevRocketThrusterColor);
    if (this.mostFit.goodFit)
      this.mostFit.goodFit.show(Config.p5.goodRocketColor, Config.p5.prevRocketThrusterColor);

  };

  /**
   * Genetic Algorithm.
   */
  evolve = () => {
    this.calcFitness();
    this.setFitnessRatio();
    this.generateMatingPool();
    this.nextGeneration();
  };

  /**
   * Calculating Fitness of all rockets.
   * Also finding the best three rockets.
   */
  calcFitness = () => {
    this.bestFit = 0;
    this.betterFit = 0;
    this.goodFit = 0;

    this.rockets.forEach(rocket => {
      let fit = rocket.calcFitness(this.goalX, this.goalY);
      if (fit > this.bestFit) {
        this.mostFit.goodFit = this.mostFit.betterFit;
        this.goodFit = this.betterFit;

        this.mostFit.betterFit = this.mostFit.bestFit;
        this.betterFit = this.bestFit;

        this.mostFit.bestFit = rocket;
        this.bestFit = fit;

      } else if (fit > this.betterFit) {
        this.mostFit.goodFit = this.mostFit.betterFit;
        this.goodFit = this.betterFit;

        this.mostFit.betterFit = rocket;
        this.betterFit = fit;

      } else if (fit > this.goodFit) {
        this.mostFit.goodFit = rocket;
        this.goodFit = fit;
      }
    });
  };

  /**
   * Normalize Fitness Scores.
   */
  setFitnessRatio = () => this.rockets.forEach(rocket => rocket.fitnessRatio = rocket.fitness / this.bestFit);


  /**
   * Mating Pool for selection.
   */
  generateMatingPool = () => {
    this.rockets.forEach(rocket => {
      let n = rocket.fitnessRatio * 500;
      for (let i = 0; i < n; i++) {
        this.matingPool.push(rocket);
      }
    })
  };

  /**
   * Generate new Rockets.
   */
  nextGeneration = () => {
    let rockets = [];
    for (let i = 0; i < Config.popSize; i++) rockets.push(this.crossover(this.selection(), this.selection(), i));
    this.rockets = rockets;
    this.generation += 1;
  };

  /**
   * Rank based Selection.
   * @returns {number | Number | *}
   */
  selection = () => this.p.random(this.matingPool);

  /**
   * Random point Crossover.
   * @param rocket1
   * @param rocket2
   * @param id
   * @returns {Rocket}
   */
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