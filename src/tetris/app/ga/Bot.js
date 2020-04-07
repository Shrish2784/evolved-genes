import Grid from "../component/objects/Grid";
import Config from "../app_config";

export default class Bot {
  constructor(p) {
    this.p = p;
    this.grid = new Grid(p);
    this.isDead = false;
    this.numOfLinesCleared = 0;
  }

  reset = () => {
    this.grid.init(false);
    this.isDead = false;
    this.numOfLinesCleared = 0;
  };

  decide = (tetriminos, vector, grid = this.grid) => {
    const currentTetrimino = tetriminos.current;
    const nextTetrimino = tetriminos.next;
    const currentTetriminoShapes = currentTetrimino.tetrimino.shapes;

    let bestScore = -Infinity;
    let bestShape = null;
    let bestJIndex = null;

    let data = {
      grid: null,
      score: null,
    };

    currentTetriminoShapes.forEach((shape) => {
      const shapeWidth = shape.width;

      let currentGrid = null;
      let heuristics = null;
      let nextGrid = null;
      let nextHeuristics = null;

      for (let j = 0; j <= Config.grid.cols - shapeWidth; j++) {
        let score = -Infinity;

        currentGrid = grid.clone();
        if (Grid.apply(shape, j, currentGrid)) {

          // NEXT MOVE
          if (nextTetrimino) {
            const nextData = this.decide({current: nextTetrimino, next: null}, vector, currentGrid);
            if (nextData.score > -Infinity) nextGrid = nextData.grid;

            if (nextGrid) nextHeuristics = nextGrid.compute();
            else heuristics = currentGrid.compute();

            score = (nextHeuristics) ? this._calcScore(nextHeuristics, vector) : this._calcScore(heuristics, vector);
          }

          if (score > bestScore) {
            bestScore = score;
            bestShape = shape;
            bestJIndex = j;
            data.grid = currentGrid;
            data.score = score;
          }
        }
      }
    });

    if (nextTetrimino) {
      if (bestScore === -Infinity) {
        this.isDead = true;
      } else {
        currentTetrimino.hasBeenDecidedOn = true;
        currentTetrimino.decidedShape = bestShape;
        currentTetrimino.decidedJIndex = bestJIndex;
      }
    }

    return data;
  };

  _calcScore = (heuristics, vector) => {
    return (0 -
      (vector[0] * heuristics.aggHeight) +
      (vector[1] * heuristics.clearedRows) -
      (vector[2] * heuristics.holes) -
      (vector[3] * heuristics.bumps)
    );
  };

  play = (tetrimino) => {
    if (!this.isDead) {
      this.grid.play(tetrimino.current);
      if (tetrimino.current.hasBeenPlayed) {
        let heuristics = this.grid.compute();
        this.numOfLinesCleared += heuristics.clearedRows;
      }
    }
  };

  show = (tetrimino) => {
    this.grid.show(tetrimino);
  }
};


//===============================GA================================
//   calcFitness = () => {
//     this.fitness = this.clearedRowsCount;
//   };

//===============================P5================================

// }