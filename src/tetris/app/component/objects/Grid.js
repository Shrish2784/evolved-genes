import Config from "../../app_config";
import Slot from "./Slot";

export default class Grid {
  constructor(p) {
    this.p = p;
    this.matrix = [];
    this.heights = [];
    this.init();
    this.played = false;
  }

  static applySlot = (slots, jIndex, grid, i) => {
    slots.forEach(slot => {
      grid.matrix[i + slot[0]][jIndex + slot[1]].isFilled = true;
      if (jIndex + slot[1] === 9) console.log("9");
      grid.heights[jIndex + slot[1]] = Math.max(Config.grid.rows - (i + slot[0]), grid.heights[jIndex + slot[1]]);
    });
  };

  static isIndexPossible = (slots, jIndex, grid, i) => {
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
      isPossible = Grid.isIndexPossible(shape.slots, jIndex, grid, i);
    }

    i -= 1;
    if (i < 0) return false;

    shape.slots.forEach(slot => {
      grid.matrix[i + slot[0]][jIndex + slot[1]].isFilled = true;
    });

    // Grid.applySlot(shape.slots, jIndex, grid, i);
    return true;
  };

  //===============================================GRID HELPERS==============================================
  clone = () => {
    let grid = new Grid(this.p);
    for (let i = 0; i < Config.grid.cols; i++) grid.heights[i] = this.heights[i];
    for (let i = 0; i < Config.grid.rows; i++) for (let j = 0; j < Config.grid.cols; j++)
      grid.matrix[i][j].isFilled = this.matrix[i][j].isFilled;

    return grid;
  };

  getFilledRows = () => {
    let filledRows = [];
    this.matrix.forEach((row, ind) => {
      let isFilled = true;
      row.forEach(slot => isFilled = (isFilled) ? slot.isFilled : isFilled);
      if (isFilled) filledRows.push(ind);
    });

    return filledRows;
  };

  getHoles = () => {
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
  init = () => {
    let {rows, cols} = Config.grid;
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) row.push(new Slot(this.p, i, j));
      this.matrix.push(row);
    }
    this.heights = new Array(cols).fill(0);
  };

  compute = () => {
    //CLEARED_ROWS AND HOLES
    let filledRows = this.getFilledRows();
    let clearedRows = filledRows.length;

    filledRows.forEach(rowIndex => {
      let i = rowIndex;
      while (i > 0) {
        for (let j = 0; j < Config.grid.cols; j++) this.matrix[i][j].isFilled = this.matrix[i - 1][j].isFilled;
        i -= 1;
      }
      this.matrix[i].forEach(slot => slot.isFilled = false);
    });

    let holes = this.getHoles();

    //HEIGHT AND BUMP
    let aggHeight = 0;
    let bumps = 0;
    for (let i = 0; i < this.heights.length - 1; i++) {
      bumps += Math.abs(this.heights[i] - this.heights[i + 1]);
      aggHeight += this.heights[i];
    }
    aggHeight += this.heights[this.heights.length - 1];

    return {bumps: bumps, aggHeight: aggHeight, clearedRows: clearedRows, holes: holes};
  };

  play = (tetrimino = null, shapeIndex = null, jIndex = null) => {
    if (tetrimino != null && shapeIndex != null && jIndex != null) {
      console.log(tetrimino, shapeIndex);
      let slots = tetrimino.tetrimino.shapes[shapeIndex].slots;
      if (!Grid.isIndexPossible(slots, jIndex, this, tetrimino.i)) {
        Grid.applySlot(slots, jIndex, this, tetrimino.i - 1);
        this.played = true;
        return this.played;
      }
    }
    this.played = false;
    return this.played;
  };

  //=============================================================P5==============================================
  show = (tetrimino = null, shapeIndex = null, jIndex = null) => {
    for (let row of this.matrix) for (let slot of row) slot.show();

    if (tetrimino != null && shapeIndex != null && jIndex != null && !this.played) {
      let filledSlot = new Slot(this.p, tetrimino.i, tetrimino.j, true);
      let slots = tetrimino.tetrimino.shapes[shapeIndex].slots;
      slots.forEach(slot => {
        filledSlot.setCoordinates(tetrimino.i + slot[0], jIndex + slot[1]);
        filledSlot.show();
      });
    }
  }
}