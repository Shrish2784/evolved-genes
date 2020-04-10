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

  static apply = (shape, jIndex, grid, color) => {
    let isPossible = true;
    let i = -1;

    while (isPossible && i <= 19) {
      i += 1;
      isPossible = Grid._isIndexPossible(shape.slots, jIndex, grid, i);
    }

    i -= 1;
    if (i < 0) return false;

    Grid._applySlot(shape.slots, jIndex, grid, i, color);
    return true;
  };

  /**
   * Resets the Grid object by initializing the height array, and the matrix.
   * Keeps the older slot objects if newSlots is False.
   *
   * @param newSlots
   */
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

  /**
   * Creates a clone of the grid object, with exactly the same state
   * of the grid.
   *
   * @returns {Grid}
   */
  clone = () => {
    let grid = new Grid(this.p);
    for (let i = 0; i < Config.grid.cols; i++) grid.heights[i] = this.heights[i];
    for (let i = 0; i < Config.grid.rows; i++) for (let j = 0; j < Config.grid.cols; j++) {
      grid.matrix[i][j].isFilled = this.matrix[i][j].isFilled;
      grid.matrix[i][j].color = this.matrix[i][j].color;
    }

    return grid;
  };

  /**
   * Indexes of the rows which are completely filled.
   * @returns {[]}
   * @private
   */
  _getFilledRows = () => {
    let filledRows = [];
    this.matrix.forEach((row, ind) => {
      let isFilled = true;
      row.forEach(slot => isFilled = (isFilled) ? slot.isFilled : isFilled);
      if (isFilled) filledRows.push(ind);
    });

    return filledRows;
  };

  /**
   * Computes the number of holes in the grid.
   *
   * A Slot is considered a hole if it is not filled,
   * but has at least one filled Slot above it in the same column.
   *
   * @returns {number}
   * @private
   */
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

  /**
   * Calculates the values for all the features.
   *
   * @returns {{clearedRows: number, bumps: number, aggHeight: number, holes: number}}
   */
  compute = () => {
    /**
     * Gets the array containing the indexes
     * of rows which are completely filled.
     *
     * @type {[]}
     */
    let filledRows = this._getFilledRows();
    let clearedRows = filledRows.length;

    /**
     * Get the number of holes in the grid.
     *
     * @type {number}
     */
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

      this.matrix[i].forEach(slot => {
        slot.isFilled = false;
        slot.color = Config.slot.color;
      });
    });

    return {bumps: bumps, aggHeight: aggHeight, clearedRows: clearedRows, holes: holes};
  };

  /**
   * Render every slot in the Grid.
   */
  show = () => {
    for (let row of this.matrix) for (let slot of row) slot.show();
  };
}