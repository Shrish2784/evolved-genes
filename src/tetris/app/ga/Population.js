import Config from "../app_config";
import Vector from "./Vector";

export default class Population {
  constructor() {
    this.vectors = [];
    this.currentPlayingVectorIndex = 0;
    this.areAllVectorsPlayed = false;
    this.initVectors();
  }

  initVectors = () => {
    for (let i = 0; i < Config.popSize; i++) this.vectors.push(new Vector());
  };
}