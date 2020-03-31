import DNA from "./DNA";

export default class Population {
  constructor(popSize, target) {
    this.target = target;
    this.popSize = popSize;
    this.population = [];
    this.generation = 0;
    this.initPop();
    this.bestFit = null;
  }

  initPop = () => {
    for (let i = 0; i < this.popSize; i++)
      this.population.push(new DNA(this.target));
  };

  getBestFit = () => {
    return this.bestFit
  };

  calculateFitness = () => {
    this.bestFit = this.population[0];
    let sumFit = 0;
    this.population.forEach((dna) => {
      let fitness = dna.calculateFitness();
      this.bestFit = (fitness >= this.bestFit.fitness) ? dna : this.bestFit;
      sumFit += fitness;
    });
    this.population.forEach((dna) => dna.fitnessRatio = dna.fitness / sumFit);
    this.population.sort((dna1, dna2) => dna1.fitnessRatio - dna2.fitnessRatio)
  };

  selection = () => {
    let random = Math.random();
    let fitUpNow = 0;
    for (let i = 0; i < this.popSize; i++) {
      fitUpNow += this.population[i].fitnessRatio;
      if (fitUpNow >= random) {
        return this.population[i];
      }
    }
    //fail safe
    return this.population[this.popSize - 1];
  };

  crossover = (dna1, dna2) => {
    let dna = new DNA(this.target);
    dna.dna = "";
    let point = (Math.random() * this.target.length);
    for (let i = 0; i < this.target.length; i++)
      if (i < point) dna.dna += dna1.dna.charAt(i);
      else dna.dna += dna2.dna.charAt(i);

    dna.mutate();
    return dna;
  };

  generateNextGeneration = () => {
    this.generation += 1;
    this.bestFit = null;
    let population = [];
    for (let i = 0; i < this.popSize; i++) {
      let dna1 = this.selection();
      let dna2 = this.selection();
      let dna = this.crossover(dna1, dna2);
      population.push(dna);
    }
    this.population = population;
  }
}