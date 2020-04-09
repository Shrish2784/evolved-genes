import Config from "../app_config";
import Bot from "../ga/Bot";
import Population from "../ga/Population";
import Game from "../ga/Game";

export default function Sketch(p) {
  let population;
  let bot;
  let game;
  let tetriminos = null;
  let speedSlider = null;

  /**
   * Fixed info, i.e, Once set need not to update.
   */
  let infoDiv = null;
  let popSizeInfo = null;
  let mutRateInfo = null;
  let gamesPerVectorInfo = null;
  let movesPerGameInfo = null;

  /**
   * Variable info, updated every draw cycle.
   */
  let genInfo = null;
  let currentVectorInfo = null;
  let currentVectorIndex = null;
  let currentGameInfo = null;
  let currentMoveInfo = null;
  let bestFitInfo = null;
  let speed = null;

  let trainButton = null;
  let playing = false;

  /**
   *  Create paragraph DOM elements for rendering details of the GA.
   */
  let setInfo = () => {
    popSizeInfo = p.createP("Population Size: " + Config.popSize);
    mutRateInfo = p.createP("Mutation rate: " + Config.mutationRate);
    gamesPerVectorInfo = p.createP("Games per vector: " + Config.gamesPerVector);
    movesPerGameInfo = p.createP("Moves per game: " + Config.movesPerGame);

    genInfo = p.createP("Current Generation: " + 0);
    currentVectorInfo = p.createP();
    currentVectorIndex = p.createP("Current vector index: " + 0);
    currentGameInfo = p.createP("Current Game: " + 0);
    currentMoveInfo = p.createP("Current move: " + 0);
    bestFitInfo = p.createP();
    speed = p.createP("Speed: " + 1);

    infoDiv.child(popSizeInfo);
    infoDiv.child(mutRateInfo);
    infoDiv.child(gamesPerVectorInfo);
    infoDiv.child(movesPerGameInfo);
    infoDiv.child(genInfo);
    infoDiv.child(currentVectorInfo);
    infoDiv.child(currentVectorIndex);
    infoDiv.child(currentGameInfo);
    infoDiv.child(currentMoveInfo);
    infoDiv.child(bestFitInfo);
    infoDiv.child(speed);
  };

  /**
   * Training Pause/Play facility.
   */
  let play = () => {
    if (playing) {
      p.noLoop();
      playing = false;
      trainButton.html("Resume");
    } else {
      playing = true;
      p.draw = draw;
      p.loop();
      trainButton.html("Pause");
    }
  };


  p.setup = () => {
    p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);
    p.background(Config.p5.background);

    /**
     * Setup the population, the bot, and the game.
     */
    population = new Population(p);
    bot = new Bot(p);
    game = new Game();
    tetriminos = game.getTetrimino();

    /**
     * Create information Div on the dom.
     */
    infoDiv = p.createDiv();
    infoDiv.addClass("p5-info");
    setInfo();

    /**
     * Speed setup
     */
    speedSlider = p.createSlider(1, 1000, 0, 10);

    /**
     * Train button and it's handler.
     */
    trainButton = p.createButton("Train");
    trainButton.addClass("p5-button");
    trainButton.mousePressed(play);

    // p.frameRate(10);
  };

  let draw = () => {
    for (let i = 0; i < speedSlider.value(); i++) {
      speed.html("Speed: " + speedSlider.value());
      p.background(Config.p5.background);

      if (population.areAllVectorsPlayed) {
        population.nextGeneration();
        localStorage.setItem("bestVector", JSON.stringify(population.bestVector));
        genInfo.html("Current Generation: " + population.generation);
        bestFitInfo.html("Lines cleared this generation: " + population.bestVector.fitness);
      } else {
        /**
         * Printing INFO on the screen.
         */
        let currentVector = population.getVector();
        currentVectorInfo.html("Current Vector: [" + currentVector.vector.aggHeight + ", " + currentVector.vector.clearedRows + ", " + currentVector.vector.holes + ", " + currentVector.vector.bumps + "]");
        currentVectorIndex.html("Current vector index: " + population.currentPlayingVectorIndex);
        currentGameInfo.html("Current Game: " + currentVector.numOfGamesPlayed);
        currentMoveInfo.html("Current Move: " + game.moveCount);

        /**
         * If bot is not dead and the game is not complete then
         * continue with the current Vector with the current game.
         */
        if (!bot.isDead && !game.isCompleted) {
          /**
           * Get the next tetrimino if the current one is played.
           *
           * isPlayed means that the tetrimino is placed where it
           * was decided to be placed by the bot.
           */
          if (tetriminos.current.hasBeenPlayed) tetriminos = game.getTetrimino();

          /**
           * If the bot has not yet decided as to where to put the current
           * tetrimino, then ask bot to decide the move.
           */
          if (!tetriminos.current.hasBeenDecidedOn) bot.decide(tetriminos, currentVector.vector);

          /**
           * Since the bot has decided on the move, tell it to play
           * the move if the current tetrimino hasn't been played with.
           */
          if (!tetriminos.current.hasBeenPlayed) {
            bot.play(tetriminos);
            tetriminos.current.i += 1;
          }
          bot.show(tetriminos.current);
        } else {
          /**
           * If the bot has died or the moves per game have been reached
           * tell the population object that the game has been completed.
           */
          population.completedGame(bot.numOfLinesCleared);
          bot.reset();
          game.reset();
          tetriminos = game.getTetrimino();
        }
      }
    }
  }
}