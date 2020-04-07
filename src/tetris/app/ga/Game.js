import {getNewTetrimino} from "../helper";
import Config from "../app_config";

export default class Game {
  constructor() {
    this.isCompleted = false;
    this.moveCount = 0;

    this.currentTetrimino = getNewTetrimino();
    this.nextTetrimino = getNewTetrimino();
  }

  reset = () => {
    this.isCompleted = false;
    this.moveCount = 0;

    this.currentTetrimino = getNewTetrimino();
    this.nextTetrimino = getNewTetrimino();
  };

  getTetrimino = () => {
    this.currentTetrimino = this.nextTetrimino;
    this.nextTetrimino = getNewTetrimino();
    this.moveCount += 1;
    if (this.moveCount === Config.movesPerGame) {
      console.log("game completed");
      this.isCompleted = true;
    }
    return {current: this.currentTetrimino, next: this.nextTetrimino};
  }
}