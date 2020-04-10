import {getNewTetrimino} from "../helper";
import Config from "../app_config";

export default class Game {
  constructor() {
    this.isCompleted = false;
    this.moveCount = 0;

    this.currentTetrimino = getNewTetrimino();
    this.nextTetrimino = getNewTetrimino();
  }

  /**
   * Resets the game
   */
  reset = () => {
    this.isCompleted = false;
    this.moveCount = 0;

    this.currentTetrimino = getNewTetrimino();
    this.nextTetrimino = getNewTetrimino();
  };

  /**
   * Returns the next two new Tetriminos.
   *
   * @returns {{current: Tetrimino, next: Tetrimino}}
   */
  getTetrimino = () => {
    this.currentTetrimino = this.nextTetrimino;
    this.nextTetrimino = getNewTetrimino();
    this.moveCount += 1;
    if (this.moveCount === Config.movesPerGame) {
      this.isCompleted = true;
    }
    return {current: this.currentTetrimino, next: this.nextTetrimino};
  }
}