import {getTetriType, tetriminoes} from "../../helper";

export default class Tetrimino {
  constructor(type) {
    this.i = 0;
    this.j = 0;

    this.tetrimino = tetriminoes[getTetriType[type]];
    this.color = this.tetrimino.color;
    this.hasBeenPlayed = false;
    this.hasBeenDecidedOn = false;
    this.decidedShape = null;
    this.decidedJIndex = null;
    this.type = type;
  }
}