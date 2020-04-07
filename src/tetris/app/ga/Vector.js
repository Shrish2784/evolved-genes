export default class Vector {
  constructor() {
    this.vector = [];

    this.vector.push(Math.random());
    this.vector.push(Math.random());
    this.vector.push(Math.random());
    this.vector.push(Math.random());

    /**
     * Upper limit of numOfGamesPlayed is checked inside
     * population from where completedGame() func is called.
     */
    this.numOfGamesPlayed = 0;
    this.fitness = 1;
  }

  reset = () => {
    this.numOfGamesPlayed = 0;
    this.fitness = 1;
  };

  completedGame = (numOfLinesCleared) => {
    this.numOfGamesPlayed += 1;
    this.fitness += numOfLinesCleared;
  };
}


/* ARCHIVE

    /H
    this.vector.push(0.610066);
    //L
    this.vector.push(0.960666);
    //Hole
    this.vector.push(0.75663);
    //bumps
    this.vector.push(0.384483);
 */