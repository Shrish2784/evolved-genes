import Config from "../app_config";
import Vector from "./Vector";

export default class Population {
  constructor(p) {
    this.p = p;
    this.generation = 0;
    let localGeneration = parseInt(localStorage.getItem("generation"));
    if (localGeneration) {
      this.generation = localGeneration;
      console.log(this.generation);
    } else localStorage.setItem("generation", this.generation);
    this.bestVector = null;
    this.noise = null;

    /**
     * @type {Vector[]}
     */
    this.vectors = [];
    this.currentPlayingVectorIndex = 0;
    this.areAllVectorsPlayed = false;
    this.initVectors();
  }

  //====================SETUP====================
  /**
   * Initialize all the vectors.
   * @param params
   */
  initVectors = (params = null) => {
    this.vectors = [];
    localStorage.setItem("generation", this.generation);
    for (let i = 0; i < Config.popSize; i++) this.vectors.push(new Vector(this.p, params, this.generation));
  };

  /**
   * Reset the population properties.
   */
  reset = () => {
    this.generation += 1;
    this.currentPlayingVectorIndex = 0;
    this.areAllVectorsPlayed = false;
  };


  //====================GAME====================
  /**
   * Get the current vector.
   * @returns {Vector}
   */
  getVector = () => this.vectors[this.currentPlayingVectorIndex];

  /**
   * On completion of a game, Sets current Vector's fitness
   * Checks if the number of games played by the vector has
   * increased the max number of games allowed, marks the
   * current vector as played.
   *
   * @param numOfLinesCleared
   */
  completedGame = (numOfLinesCleared) => {
    let vector = this.vectors[this.currentPlayingVectorIndex];

    vector.completedGame(numOfLinesCleared);
    if (vector.numOfGamesPlayed >= Config.gamesPerVector) this._playedCurrentVector();
  };

  /**
   * Current vector has played max games, increase {currentPlayingVectorIndex}
   * Mark current population as complete if all the vectors have played all the
   * games.
   *
   * @private
   */
  _playedCurrentVector = () => {
    this.currentPlayingVectorIndex += 1;
    this.areAllVectorsPlayed = this.currentPlayingVectorIndex >= this.vectors.length;
  };

  //==============================GA+================================
  /**
   * Generate the next generation.
   *
   * Uses Cross Entropy.
   * Todo: Use noise to prevent early convergence.
   */
  nextGeneration = () => {
    let {selectionSize, popSize} = Config;

    this.vectors.sort((vector1, vector2) => (vector1.fitness - vector2.fitness));
    this.bestVector = this.vectors[popSize - 1];

    let count = (popSize * selectionSize);
    let index = popSize - count;
    let params = {
      aggHeight: {mean: 0, sd: 1},
      holes: {mean: 0, sd: 1},
      bumps: {mean: 0, sd: 1},
      clearedRows: {mean: 0, sd: 1}
    };

    let aggHeightSum = 0, holeSum = 0, bumpSum = 0, clearedRowSum = 0;
    let bestPop = this.vectors.slice(index, popSize);
    for (let i = 0; i < count; i++) {
      let v = bestPop[i].vector;

      clearedRowSum += v.clearedRows;
      holeSum += v.holes;
      bumpSum += v.bumps;
      aggHeightSum += v.aggHeight;
    }

    params.aggHeight.mean = aggHeightSum / count;
    params.holes.mean = holeSum / count;
    params.bumps.mean = bumpSum / count;
    params.clearedRows.mean = clearedRowSum / count;

    clearedRowSum = 0;
    holeSum = 0;
    bumpSum = 0;
    aggHeightSum = 0;

    for (let i = 0; i < count; i++) {
      let v = bestPop[i].vector;

      clearedRowSum += Math.pow(v.clearedRows - params.clearedRows.mean, 2);
      holeSum += Math.pow(v.holes - params.holes.mean, 2);
      bumpSum += Math.pow(v.bumps - params.bumps.mean, 2);
      aggHeightSum += Math.pow(v.aggHeight - params.aggHeight.mean, 2);
    }

    clearedRowSum /= count;
    holeSum /= count;
    bumpSum /= count;
    aggHeightSum /= count;

    params.aggHeight.sd = Math.sqrt(aggHeightSum);
    params.clearedRows.sd = Math.sqrt(clearedRowSum);
    params.bumps.sd = Math.sqrt(bumpSum);
    params.holes.sd = Math.sqrt(holeSum);

    this.reset();
    this.initVectors(params);
  };
}
