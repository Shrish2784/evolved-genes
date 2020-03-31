import Config from "./config";

export default class DNA {
  constructor(target) {
    this.target = target;
    this.length = this.target.length;
    this.dna = this.makeDna();
    this.fitness = 0;
    this.fitnessRatio = 0;
  }

  makeDna = () => {
    let result = '';
    for (let i = 0; i < this.length; i++)
      result += Config.characters.charAt(Math.floor(Math.random() * Config.charactersLength));
    return result;
  };

  mutate = () => {
    if (Math.random() <= Config.mutationRate) {
      let point = (Math.random() * this.target.length);
      this.dna = this.dna.substr(0, point)
        + Config.characters.charAt(Math.floor(Math.random() * Config.charactersLength))
        + this.dna.substr(point + 1);
    }
  };

  calculateFitness = () => {
    let fit = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.dna.charAt(i) === this.target.charAt(i)) fit += 1;
    }
    this.fitness = fit / this.length;
    return this.fitness;
  }
}