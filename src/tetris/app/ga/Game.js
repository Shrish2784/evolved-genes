import {getNewTetrimino} from "../helper";
import Config from "../app_config";

export default class Game {
  constructor() {
    this.isCompleted = false;
    this.moveCount = 0;

    this.currentTetrimino = getNewTetrimino();
    this.nextTetrimino = getNewTetrimino();
  }


  getTetrimino = () => {
    if (this.moveCount === Config.movesPerGame) {
      this.isCompleted = true;
      return null;
    } else {
      this.currentTetrimino = this.nextTetrimino;
      this.nextTetrimino = getNewTetrimino();
      return {current: this.currentTetrimino, next: this.nextTetrimino};
    }
  }
}