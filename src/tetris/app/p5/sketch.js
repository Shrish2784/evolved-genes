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

  let showGrid = true;

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
  let showButton = null;
  let playing = false;

  /**
   *  Create paragraph DOM elements for rendering details of the GA.
   */
  let setInfo = () => {
    popSizeInfo = p.createP("Population Size: " + Config.popSize);
    mutRateInfo = p.createP("Mutation rate: " + Config.mutationRate);
    gamesPerVectorInfo = p.createP("Games per vector: " + Config.gamesPerVector);
    movesPerGameInfo = p.createP("Moves per game: " + Config.movesPerGame);

    genInfo = p.createP("Current Generation: " + population.generation) ;
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
   * Renders paragraph DOM elements containing details of the GA.
   */
  let printInfo = () => {
    let currentVector = population.getVector();
    currentVectorInfo.html("Current Vector: [" + currentVector.vector.aggHeight + ", " + currentVector.vector.clearedRows + ", " + currentVector.vector.holes + ", " + currentVector.vector.bumps + "]");
    currentVectorIndex.html("Current vector index: " + population.currentPlayingVectorIndex);
    currentGameInfo.html("Current Game: " + currentVector.numOfGamesPlayed);
    currentMoveInfo.html("Current Move: " + game.moveCount);
  };

  /**
   * Training Pause/Play logic.
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

    /**
     * Show Button to toggle board display.
     */
    showButton = p.createButton("Hide");
    showButton.addClass("p5-button");
    showButton.mousePressed(() => {
      showGrid = !showGrid;
      showButton.html((showGrid) ? "Hide" : "Show");
    });

    // p.frameRate();
  };

  let draw = () => {
    /**
     * This loop controls the number of cycles of the
     * algorithm to run in a single frame.
     */
    for (let i = 0; i < speedSlider.value(); i++) {

      /**
       * Display the number of cycle.
       */
      speed.html("Speed: " + speedSlider.value());
      p.background(Config.p5.background);

      /**
       * If all the vectors have played all the games,
       * generate new vectors evolving from previous ones.
       */
      if (population.areAllVectorsPlayed) {
        population.nextGeneration();

        /**
         * Store the Vector object with the best fitness in
         *  the localstorage.
         */
        localStorage.setItem("bestVector", JSON.stringify(population.bestVector));

        /**
         * Display generation details.
         */
        genInfo.html("Current Generation: " + population.generation);
        bestFitInfo.html("Lines cleared this generation: " + population.bestVector.fitness);
      } else {
        /**
         * Printing INFO on the screen.
         */
        printInfo();

        /**
         * If bot is not dead and the game is not complete then
         * continue with the current Vector with the current game.
         */
        if (!bot.isDead && !game.isCompleted) {
          /**
           * Bot plays the current move and adjusts the
           * board accordingly.
           */
          bot.play(tetriminos, population.getVector());

          /**
           * Get the next Tetriminos.
           * @type {{next: Tetrimino, current: Tetrimino}}
           */
          tetriminos = game.getTetrimino();

          /**
           * Show the board only if the flag is true.
           *
           * This helps removing rendering load during training.
           */
          if (showGrid) bot.show();
        } else {
          /**
           * If the bot has died or the moves per game have been reached
           * tell the population object that the game has been completed.
           */
          population.completedGame(bot.numOfLinesCleared);
          bot.reset();
          game.reset();

          /**
           * Get the next Tetriminos.
           * @type {{next: Tetrimino, current: Tetrimino}}
           */
          tetriminos = game.getTetrimino();
        }
      }
    }
  }
}