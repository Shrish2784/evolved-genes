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

  /**
   * Initializing the DNA objects.
   */
  initPop = () => {
    for (let i = 0; i < this.popSize; i++)
      this.population.push(new DNA(this.target));
  };

  /**
   * Getter : Best Fitness last Generation.
   * @returns {null|*|number}
   */
  getBestFit = () => {
    return this.bestFit
  };

  /**
   * Fitness of DNAs.
   */
  calculateFitness = () => {
    this.bestFit = this.population[0];
    let sumFit = 0;

    /**
     * Loop through all DNAs, calculate fitness of all DNAs,
     * and save the best fitness for displaying on the canvas.
     */
    this.population.forEach((dna) => {
      let fitness = dna.calculateFitness();
      this.bestFit = (fitness >= this.bestFit.fitness) ? dna : this.bestFit;
      sumFit += fitness;
    });
    this.population.forEach((dna) => dna.fitnessRatio = dna.fitness / sumFit);
    this.population.sort((dna1, dna2) => dna1.fitnessRatio - dna2.fitnessRatio)
  };

  /**
   * Roulette Wheel Selection
   * @returns Selected DNA.
   */
  selection = () => {
    let random = Math.random();
    let fitUpNow = 0;
    for (let i = 0; i < this.popSize; i++) {
      fitUpNow += this.population[i].fitnessRatio;
      if (fitUpNow >= random) {
        return this.population[i];
      }
    }
  };

  /**
   * Random point Crossover.
   * @param dna1
   * @param dna2
   * @returns New {DNA}
   */
  crossover = (dna1, dna2) => {
    let dna = new DNA(this.target);
    dna.dna = "";
    let point = (Math.random() * this.target.length);
    for (let i = 0; i < this.target.length; i++)
      if (i < point) dna.dna += dna1.dna.charAt(i);
      else dna.dna += dna2.dna.charAt(i);

    /**
     * Mutation of the new DNA.
     */
    dna.mutate();
    return dna;
  };

  /**
   * Next generation.
   */
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