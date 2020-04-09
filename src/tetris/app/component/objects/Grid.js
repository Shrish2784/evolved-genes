import Config from "../../app_config";
import Slot from "./Slot";

export default class Grid {
  constructor(p) {
    this.p = p;
    this.matrix = [];
    this.heights = [];
    this.init();
  }

  static _applySlot = (slots, jIndex, grid, i, color = "rgb(255,255,255)") => {
    slots.forEach(slot => {
      grid.matrix[i + slot[0]][jIndex + slot[1]].isFilled = true;
      if (color) grid.matrix[i + slot[0]][jIndex + slot[1]].color = color;
      grid.heights[jIndex + slot[1]] = Math.max(Config.grid.rows - (i + slot[0]), grid.heights[jIndex + slot[1]]);
    });
  };

  static _isIndexPossible = (slots, jIndex, grid, i) => {
    let isPossible = true;
    for (let j = 0; j < slots.length; j++) {
      const slot = slots[j];
      const indexI = i + slot[0];
      const indexJ = jIndex + slot[1];

      if (indexI < 0 || indexI > Config.grid.rows - 1 || indexJ < 0 || indexJ > Config.grid.cols - 1) {
        isPossible = false;
        break;
      }
      if (grid.matrix[i + slot[0]][jIndex + slot[1]].isFilled) {
        isPossible = false;
        break;
      }
    }

    return isPossible;
  };

  static apply = (shape, jIndex, grid) => {
    let isPossible = true;
    let i = -1;

    while (isPossible && i <= 19) {
      i += 1;
      isPossible = Grid._isIndexPossible(shape.slots, jIndex, grid, i);
    }

    i -= 1;
    if (i < 0) return false;

    Grid._applySlot(shape.slots, jIndex, grid, i);
    return true;
  };

  init = (newSlots = true) => {
    let {rows, cols} = Config.grid;
    for (let i = 0; i < rows; i++) {
      if (newSlots) {
        let row = [];
        for (let j = 0; j < cols; j++) row.push(new Slot(this.p, i, j));
        this.matrix.push(row);
      } else {
        for (let j = 0; j < cols; j++) {
          this.matrix[i][j].isFilled = false;
          this.matrix[i][j].color = Config.slot.color;
        }
      }
    }
    this.heights = new Array(cols).fill(0);
  };

  //===============================================GRID HELPERS==============================================
  clone = () => {
    let grid = new Grid(this.p);
    for (let i = 0; i < Config.grid.cols; i++) grid.heights[i] = this.heights[i];
    for (let i = 0; i < Config.grid.rows; i++) for (let j = 0; j < Config.grid.cols; j++)
      grid.matrix[i][j].isFilled = this.matrix[i][j].isFilled;

    return grid;
  };

  _getFilledRows = () => {
    let filledRows = [];
    this.matrix.forEach((row, ind) => {
      let isFilled = true;
      row.forEach(slot => isFilled = (isFilled) ? slot.isFilled : isFilled);
      if (isFilled) filledRows.push(ind);
    });

    return filledRows;
  };

  _getHoles = () => {
    let holes = 0;
    for (let j = 0; j < Config.grid.cols; j++) {
      let foundFilled = false;
      for (let i = 0; i < Config.grid.rows; i++) {
        foundFilled = (foundFilled) ? true : this.matrix[i][j].isFilled;
        if (!this.matrix[i][j].isFilled && foundFilled) holes += 1;
      }
    }
    return holes;
  };

  //==========================================================GAME=============================================

  compute = () => {
    //Calculate Filled Rows
    let filledRows = this._getFilledRows();
    let clearedRows = filledRows.length;

    //Calculate Rows
    let holes = this._getHoles();

    /**
     * Calculate Aggregate height of all rows and calculate the bumps.
     */
    let aggHeight = 0;
    let bumps = 0;
    for (let i = 0; i < this.heights.length - 1; i++) {
      bumps += Math.abs(this.heights[i] - this.heights[i + 1]);
      aggHeight += this.heights[i];
    }
    aggHeight += this.heights[this.heights.length - 1];

    /**
     * Removing the completely filled rows.
     */
    filledRows.forEach(rowIndex => {
      let i = rowIndex;
      while (i > 0) {
        for (let j = 0; j < Config.grid.cols; j++) {
          this.matrix[i][j].isFilled = this.matrix[i - 1][j].isFilled;
          this.matrix[i][j].color = this.matrix[i - 1][j].color;
        }
        i -= 1;
      }
      this.matrix[i].forEach(slot => slot.isFilled = false);
    });

    return {bumps: bumps, aggHeight: aggHeight, clearedRows: clearedRows, holes: holes};
  };

  play = (tetrimino = null) => {
    if (tetrimino != null) {
      if (tetrimino.hasBeenDecidedOn) {
        let slots = tetrimino.decidedShape.slots;

        //TODO: Improve this part for the TRAINING.
        if (!Grid._isIndexPossible(slots, tetrimino.decidedJIndex, this, tetrimino.i)) {
          Grid._applySlot(slots, tetrimino.decidedJIndex, this, tetrimino.i - 1, tetrimino.color);
          tetrimino.hasBeenPlayed = true;
        }
      }
    }
    return false;
  };

  //===============================================P5=====================================================
  show = (tetrimino = null) => {
    for (let row of this.matrix) for (let slot of row) slot.show();

    if (tetrimino != null) {
      if (tetrimino.hasBeenDecidedOn && !tetrimino.hasBeenPlayed) {
        let filledSlot = new Slot(this.p, tetrimino.i, tetrimino.j, true);
        let slots = tetrimino.decidedShape.slots;
        slots.forEach(slot => {
          filledSlot.setCoordinates(tetrimino.i + slot[0], tetrimino.decidedJIndex + slot[1]);
          filledSlot.color = tetrimino.color;
          filledSlot.show();
        });
      }
    }
  }
}