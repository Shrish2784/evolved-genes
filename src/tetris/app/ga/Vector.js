export default class Vector {
  constructor(p, params, generation) {
    this.vector = {};
    this.generation = generation;

    this.initVectors(p, params, generation);

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

  /**
   * Initializes new population of vectors using Gaussian Distribution.
   * params provides the Mean and Standard distribution for all the
   * features.
   *
   * @param p
   * @param params
   * @param generation
   */
  initVectors = (p, params, generation) => {

    /**
     * If params are not provided, check if localstorage has params
     * stored in it.
     */
    if (!params) params = JSON.parse(localStorage.getItem("params"));

    /**
     * If params are not found in localStorage as well, initialize them with
     * default values.
     */
    if (!params) params = {
      aggHeight: {mean: -0.5, sd: 1},
      holes: {mean: -0.5, sd: 1},
      bumps: {mean: -0.5, sd: 1},
      clearedRows: {mean: 0.5, sd: 1}
    };

    /**
     * Storing the params in the localStorage,
     * this helps in continuing the training process where
     * it was left.
     */
    localStorage.setItem("params", JSON.stringify(params));

    let noise = this._calcNoise();

    localStorage.setItem("noise", noise);

    /**
     * Generating weights for all the features..
     */
    this.vector.clearedRows = p.randomGaussian(params.clearedRows.mean, params.clearedRows.sd);
    this.vector.bumps = p.randomGaussian(params.bumps.mean, params.bumps.sd);
    this.vector.holes = p.randomGaussian(params.holes.mean, params.holes.sd);
    this.vector.aggHeight = p.randomGaussian(params.aggHeight.mean, params.aggHeight.sd);

    // this.vector.clearedRows = 0.96;
    // this.vector.bumps = -0.38;
    // this.vector.holes = -0.75;
    // this.vector.aggHeight = -0.61;

  };

  /**
   * On game completion set the lines this
   * vector cleared in all the games it played
   * which becomes it's fitness.
   *
   * @param numOfLinesCleared
   */
  completedGame = (numOfLinesCleared) => {
    this.numOfGamesPlayed += 1;
    this.fitness += numOfLinesCleared;
  };

  _calcNoise = () => {
    return (this.generation === 0) ? 0 : Math.exp(this.generation / -10);
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