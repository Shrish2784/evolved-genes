import {getTetriType, tetriminoes} from "../../helper";

export default class Tetrimino {
  constructor(type) {
    this.i = 0;
    this.j = 0;
    this.tetrimino = tetriminoes[getTetriType[type]];
    this.isDone = false;
    this.isDecided = false;
    this.type = type;
  }
}