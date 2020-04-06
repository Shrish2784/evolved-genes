import Grid from "../component/objects/Grid";
import Config from "../app_config";

export default class Bot {
  constructor(p) {
    //P5
    this.p = p;
    this.grid = new Grid(p);
    this.isDead = false;

    //Game
    this.params = [];
    this.score = null;
    this.shapeIndex = null;
    this.jIndex = null;
    this.heuristics = null;
    this.initParams();

    //GA
    this.numOfMoves = 0;
    this.clearedRowsCount = 0;
    this.fitness = 0;
    this.fitnessRatio = null;
  }

  //==============================GAME===============================
  initParams = () => {
    this.params.push(Math.random());
    this.params.push(Math.random());
    this.params.push(Math.random());
    this.params.push(Math.random());
  };

  decide = (currentTetrimino, nextTetrimino, grid = this.grid, params) => {
    const currentTetriminoShapes = currentTetrimino.tetrimino.shapes;

    let bestScore = -Infinity;
    let bestShapeIndex = null;
    let jIndex = null;

    let data = {
      grid: null,
      score: null,
    };

    currentTetriminoShapes.forEach((shape, shapeIndex) => {
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
              const nextData = this.decide(nextTetrimino, null, currentGrid);
              if (nextData.score > -Infinity) nextGrid = nextData.grid;
            }

            if (nextGrid) nextHeuristics = nextGrid.compute();
            else heuristics = currentGrid.compute();

            score = (nextHeuristics) ? this.calcScore(nextHeuristics) : this.calcScore(heuristics);
          }

          if (score >= bestScore) {
            bestScore = score;
            bestShapeIndex = shapeIndex;
            jIndex = j;
            data.grid = currentGrid;
            data.score = score;
          }
        }
      }
    );

    if (nextTetrimino) {
      if (bestScore === -Infinity) {
        this.isDead = true;
      } else {
        this.numOfMoves += 1;
        this.score = bestScore;
        this.shapeIndex = bestShapeIndex;
        this.jIndex = jIndex;
      }
    }

    return data;
  };

  play = (tetrimino) => {
    let isDone = this.grid.play(tetrimino, this.shapeIndex, this.jIndex);
    if (isDone) {
      this.heuristics = this.grid.compute();
      this.clearedRowsCount += this.heuristics.clearedRows;
      this.calcFitness();
    }
    return isDone;
  };

  calcScore = (heuristics, params) => {
    return (0 -
      (params[0] * heuristics.aggHeight) +
      (params[1] * heuristics.clearedRows) -
      (params[2] * heuristics.holes) -
      (params[3] * heuristics.bumps)
    );
  };


//===============================GA================================
  calcFitness = () => {
    this.fitness = this.clearedRowsCount;
  };

//===============================P5================================
  show = (tetrimino) => {
    this.grid.show(tetrimino, this.shapeIndex, this.jIndex);
  }
}