import Config from "../app_config";
import Vector from "./Vector";

export default class Population {
  constructor(p) {
    this.p = p;
    this.generation = 0;
    this.bestVector = null;
    this.bestFitness = 0;
    this.vectors = [];
    this.currentPlayingVectorIndex = 0;
    this.areAllVectorsPlayed = false;
    this.initVectors();
  }

  //====================SETUP====================
  initVectors = () => {
    for (let i = 0; i < Config.popSize; i++) this.vectors.push(new Vector());
  };

  reset = () => {
    this.generation += 1;
    this.vectors.forEach(vector => vector.reset());
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
    this.bestVector = this.vectors[0];
    this.vectors.forEach(vector => {
      if (vector.fitness > this.bestFitness) {
        this.bestFitness = vector.fitness;
        this.bestVector = vector.vector;
      }
    });

    let newPop = [];
    let {selectionSize, popSize} = Config;
    for (let i = 0; i < (selectionSize * popSize); i++) {
      let subPop = this.getCandidates();

      let bestVector = null;
      let bestVectorFitness = 0;
      let betterVector = null;
      let betterVectorFitness = 0;
      for (let vector of subPop)
        if (vector.fitness > bestVectorFitness) {
          betterVector = bestVector;
          betterVectorFitness = bestVectorFitness;
          bestVector = vector;
          bestVectorFitness = vector.fitness;
        } else if (vector.fitness > betterVectorFitness) {
          betterVector = vector;
          betterVectorFitness = vector.fitness;
        }

      newPop.push(this.crossOver(bestVector, betterVector));
    }

    this.vectors.sort((vector1, vector2) => (vector1.fitness - vector2.fitness));
    this.vectors.splice(0, selectionSize * popSize);
    this.vectors = [...newPop, ...this.vectors];
    this.reset();
  };

  getCandidates = () => {
    let {tournamentSize, popSize} = Config;
    let subPop = [];
    for (let i = 0; i < (tournamentSize * popSize); i++) subPop.push(this.vectors[Math.floor(Math.random() * popSize)]);
    return subPop;
  };

  crossOver = (vector1, vector2) => {
    let vector = [];
    // let sum = 0;
    // for (let i = 0; i < 4; i++) {
    //   vector1.vector[i] *= vector1.fitness;
    //   vector2.vector[i] *= vector2.fitness;
    //   vector[i] = vector1.vector[i] + vector2.vector[i];
    //   sum += vector[i];
    // }
    //
    // sum = Math.sqrt(sum);
    // for (let i = 0; i < 4; i++) {
    //   vector[i] /= sum;
    // }

    for (let i = 0; i < 4; i++) {
      vector[i] = this.p.random([vector1.vector[i], vector2.vector[i]]);
    }

    let v = new Vector();
    v.vector = vector;
    return v;
  };
}
