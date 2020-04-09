import Config from "../app_config";
import Vector from "./Vector";

export default class Population {
  constructor(p) {
    this.p = p;
    this.generation = 0;
    this.bestVector = null;
    this.vectors = [];
    this.currentPlayingVectorIndex = 0;
    this.areAllVectorsPlayed = false;
    this.initVectors();
  }

  //====================SETUP====================
  initVectors = (params = null) => {
    this.vectors = [];
    for (let i = 0; i < Config.popSize; i++) this.vectors.push(new Vector(this.p, params));
  };

  reset = () => {
    this.generation += 1;
    this.currentPlayingVectorIndex = 0;
    this.areAllVectorsPlayed = false;
  };


  //====================GAME====================
  getVector = () => this.vectors[this.currentPlayingVectorIndex];

  completedGame = (numOfLinesCleared) => {
    let vector = this.vectors[this.currentPlayingVectorIndex];

    vector.completedGame(numOfLinesCleared);
    if (vector.numOfGamesPlayed >= Config.gamesPerVector) this._playedCurrentVector();
  };

  _playedCurrentVector = () => {
    this.currentPlayingVectorIndex += 1;
    this.areAllVectorsPlayed = this.currentPlayingVectorIndex >= this.vectors.length;
  };

  //====================GA====================
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

    this.initVectors(params);
    this.reset();
  };
}
