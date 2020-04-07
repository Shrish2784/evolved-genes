import Config from "../app_config";
import Population from "../ga/Population";
import Obstacle from "./Obstacle";

export default function Sketch(p) {
  let canvas;
  let isGoalSet = false;
  let goalX;
  let goalY;
  let population;
  let obstacle;
  let lifespan;
  let generation;
  let bestFit;
  let count = 0;
  let paused = true;
  let pauseButton;

  let newGoal = (event) => {

    /**
     * If goal is not set, Set the goal on the canvas
     * where the User has clicked.
     */
    if (paused) {
      isGoalSet = true;
      goalX = event.offsetX;
      goalY = event.offsetY;

      /**
       * Because the location of the Goal has changed,
       * the population object is also changed.
       * @type {Population}
       */
      population = new Population(p, goalX, goalY, obstacle);

    }
  };

  p.setup = () => {
    canvas = p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);

    /**
     * Info on the screen beneath the canvas.
     */
    lifespan = p.createP();
    p.createP("Population Size: " + Config.popSize);
    p.createP("Mutation Rate: " + Config.mutationRate);
    generation = p.createP();
    bestFit = p.createP();


    /**
     * Pause and resume mechanism for the algorithm.
     */
    pauseButton = p.createButton("Start");
    pauseButton.addClass("p5-button");
    pauseButton.mousePressed(() => {
      paused = !paused;
      pauseButton.html("Pause/Resume");

      /**
       * Initialize Goal Coordinates.
       */
      if (!isGoalSet) {
        goalX = Config.p5.goal.x;
        goalY = Config.p5.goal.y;
        isGoalSet = true;

        /**
         * Population of rockets.
         * @type {Population}
         */
        population = new Population(p, goalX, goalY, obstacle);
      }
    });

    p.createP(
      "To set a new Goal, pause the Algorithm after it has started running" +
      " and click on the Canvas to set that location as the new Goal location."
    );

    /**
     * Obstacle for Rockets to avoid.
     * @type {Obstacle}
     */
    obstacle = new Obstacle(p, Config.p5.obstacle.x, Config.p5.obstacle.y, Config.p5.obstacle.w, Config.p5.obstacle.h);

    /**
     * Click event on the canvas.
     */
    canvas.mouseClicked(newGoal);
  };

  p.draw = () => {
    if (!paused) {
      p.background(Config.p5.background);
      obstacle.show();

      if (isGoalSet) {
        population.showRockets(count);
        count += 1;

        /**
         * If the Rockets have played all their moves, It's time
         * to evolve those suckers.
         */
        if (count === Config.lifespan) {
          population.evolve();
          count = 0;
        }

        /**
         * Info Details.
         */
        lifespan.html("Lifespan: " + count + " / " + Config.lifespan);
        generation.html("Generation: " + population.generation);

        /**
         * If bestFit has been found, display the info.
         */
        if (population.mostFit.bestFit) bestFit.html("Closest Distance achieved: " + population.mostFit.bestFit.d)
      }
    }
    p.fill(Config.p5.goalColor);
    if (isGoalSet) p.ellipse(goalX, goalY, Config.goalRadius, Config.goalRadius);
  };
}