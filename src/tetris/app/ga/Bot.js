import Grid from "../component/objects/Grid";
import Config from "../app_config";

export default class Bot {
  constructor(p) {
    this.p = p;
    this.grid = new Grid(p);
    this.isDead = false;
    this.heuristics = null;
    this.numOfLinesCleared = 0;
  }

  /**
   * Resets the grid.
   */
  reset = () => {
    this.grid.init(false);
    this.isDead = false;
    this.numOfLinesCleared = 0;
  };

  /**
   * Calculates the score using the Vector parameters.
   *
   * @param heuristics
   * @param vector
   * @returns {number}
   * @private
   */
  _calcScore = (heuristics, vector) => {
    return (
      (vector.clearedRows * heuristics.clearedRows) +
      (vector.aggHeight * heuristics.aggHeight) +
      (vector.holes * heuristics.holes) +
      (vector.bumps * heuristics.bumps)
    );
  };

  /**
   * Evaluates the current and the next move according to
   * the weights provided the Vector object.
   *
   * @param tetriminos {{next: Tetrimino, current: Tetrimino}}
   * @param vector {Vector}
   * @param grid {Grid}
   * @returns {{heuristics: {} | null, bestScore: number, grid: Grid, dead: boolean}}
   * @private
   */
  _getBestMove = (tetriminos, vector, grid) => {
    let currentTetrimino = tetriminos.current;
    let currentTetriminoShapes = currentTetrimino.tetrimino.shapes;

    let data = {
      bestScore: -Infinity,
      grid: null,
      heuristics: null,
      dead: false,
    };

    currentTetriminoShapes.forEach(shape => {
      const shapeWidth = shape.width;
      for (let j = 0; j <= Config.grid.cols - shapeWidth; j++) {
        let currentGridClone = grid.clone();

        if (Grid.apply(shape, j, currentGridClone, currentTetrimino.color)) {

          /**
           *
           * @type {{clearedRows: number, bumps: number, aggHeight: number, holes: number}}
           */
          let heuristics = currentGridClone.compute();
          let score = this._calcScore(heuristics, vector.vector);

          /**
           * If Next Tetrimino is also provided,
           * compute the best next move.
           */
          if (tetriminos.next) {
            let nextData = this._getBestMove({current: tetriminos.next}, vector, currentGridClone);

            /**
             * If in the next move bot doesn,t die and finds a best move
             * then consider that score instead of the current score.
             */
            if (nextData.dead && nextData.bestScore > data.bestScore) score = nextData.bestScore;
          }

          if (score > data.bestScore) data = {
            bestScore: score,
            grid: currentGridClone,
            heuristics: heuristics
          };
        }
      }
    });

    if (data.bestScore === -Infinity) data.dead = true;

    return data;
  };

  /**
   * Plays the best move considering the look a head move too
   * if provided.
   *
   * @param tetriminos {{next: Tetrimino, current: Tetrimino}}
   * @param vector { Vector }
   */
  play = (tetriminos, vector) => {
    let data = this._getBestMove(tetriminos, vector, this.grid);
    if (data.dead) this.isDead = true;
    else {
      this.heuristics = data.heuristics;
      this.grid = data.grid;
      this.numOfLinesCleared += this.heuristics.clearedRows;
    }
  };

  /**
   * Shows the Bot(It's grid basically) on the Canvas
   */
  show = () => {
    this.grid.show();
  };
};