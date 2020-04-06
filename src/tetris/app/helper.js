import Tetrimino from "./component/objects/Tetrimino";

export const numOfTypesOfTertrimino = 7;

export const getTetriType = {
  0: 'I',
  1: 'O',
  2: 'L',
  3: 'J',
  4: 'S',
  5: 'Z',
  6: 'T'
};

export const rotateArrayLeft = (arr, r, c) => {
  let newArr = new Array(r).fill(new Array(c));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) newArr[i][j] = arr[r - 1 - j][i];
  return newArr;
};


export const tetriminoes = {
  I: {
    shapes: [
      {
        slots: [[0, 0], [1, 0], [2, 0]],
        width: 1,
        height: 3
      },
      {
        slots: [[0, 0], [0, 1], [0, 2]],
        width: 3,
        height: 1
      }
    ]
  },
  O: {
    shapes: [
      {
        slots: [[0, 0], [0, 1], [1, 0], [1, 1]],
        width: 2,
        height: 2
      },
    ]
  },
  L: {
    shapes: [
      {
        slots: [[0, 0], [0, 1], [1, 0], [2, 0]],
        width: 2,
        height: 3
      },
      {
        slots: [[0, 0], [1, 0], [1, 1], [1, 2]],
        width: 3,
        height: 2
      },
      {
        slots: [[0, 1], [1, 1], [2, 1], [2, 0]],
        width: 2,
        height: 3
      },
      {
        slots: [[0, 0], [0, 1], [0, 2], [1, 2]],
        width: 3,
        height: 2
      }
    ]
  },
  J: {
    shapes: [
      {
        slots: [[0, 0], [0, 1], [1, 1], [2, 1]],
        width: 2,
        height: 3
      },
      {
        slots: [[0, 0], [0, 1], [0, 2], [1, 0]],
        width: 3,
        height: 2
      },
      {
        slots: [[0, 0], [1, 0], [2, 0], [2, 1]],
        width: 2,
        height: 3
      },
      {
        slots: [[0, 2], [1, 0], [1, 1], [1, 2]],
        width: 3,
        height: 2
      }
    ]
  },
  S: {
    shapes: [
      {
        slots: [[0, 0], [0, 1], [1, 1], [1, 2]],
        width: 3,
        height: 2
      },
      {
        slots: [[0, 1], [1, 0], [1, 1], [2, 0]],
        width: 2,
        height: 3
      }
    ]
  },
  Z: {
    shapes: [
      {
        slots: [[0, 1], [0, 2], [1, 0], [1, 1]],
        width: 3,
        height: 2
      },
      {
        slots: [[0, 0], [1, 0], [1, 1], [2, 1]],
        width: 2,
        height: 3
      },
    ]
  },
  T: {
    shapes: [
      {
        slots: [[0, 0], [0, 1], [0, 2], [1, 1]],
        width: 3,
        height: 2
      },
      {
        slots: [[0, 0], [1, 0], [2, 0], [1, 1]],
        width: 2,
        height: 3
      },
      {
        slots: [[1, 0], [1, 1], [1, 2], [0, 1]],
        width: 3,
        height: 2
      },
      {
        slots: [[0, 1], [1, 1], [2, 1], [1, 0]],
        width: 2,
        height: 3
      },
    ]
  }
};

export const getNewTetrimino = () => new Tetrimino(Math.floor(Math.random() * 7));
