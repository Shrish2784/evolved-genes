export default class Vector {
  constructor(p, params) {
    this.vector = {};

    this.initVectors(p, params);

    /**
     * Upper limit of numOfGamesPlayed is checked inside
     * population from where completedGame() func is called.
     */
    this.numOfGamesPlayed = 0;
    this.fitness = 1;
  }

  reset = () => {
    this.numOfGamesPlayed = 0;
    this.fitness = 1;
  };

  initVectors = (p, params) => {
    if (!params) params = JSON.parse(localStorage.getItem("params"));
    if (!params) params = {
      aggHeight: {mean: -0.5, sd: 0.5},
      holes: {mean: -0.5, sd: 0.5},
      bumps: {mean: -0.5, sd: 0.5},
      clearedRows: {mean: 0.5, sd: 0.5}
    };

    localStorage.setItem("params", JSON.stringify(params));

    this.vector.clearedRows = p.randomGaussian(params.clearedRows.mean, params.clearedRows.sd);
    this.vector.bumps = p.randomGaussian(params.bumps.mean, params.bumps.sd);
    this.vector.holes = p.randomGaussian(params.holes.mean, params.holes.sd);
    this.vector.aggHeight = p.randomGaussian(params.aggHeight.mean, params.aggHeight.sd);
  };

  completedGame = (numOfLinesCleared) => {
    this.numOfGamesPlayed += 1;
    this.fitness += numOfLinesCleared;
  };
}


/* ARCHIVE

    /H
    this.vector.push(0.610066);
    //L
    this.vector.push(0.960666);
    //Hole
    this.vector.push(0.75663);
    //bumps
    this.vector.push(0.384483);
 */