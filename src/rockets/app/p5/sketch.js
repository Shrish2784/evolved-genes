import Config from "../app_config";
import Population from "../ga/Population";
import Obstacle from "./Obstacle";

export default function Sketch(p) {
  let isGoalSet = false;
  let goalX;
  let goalY;
  let population;
  let obstacle;
  let lifespan;
  let generation;
  let bestFit;
  let count = 0;

  p.setup = () => {
    p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);
    lifespan = p.createP();
    p.createP("Population Size: " + Config.popSize);
    p.createP("Mutation Rate: " + Config.mutationRate);
    generation = p.createP();
    bestFit = p.createP();

    obstacle = new Obstacle(p, Config.p5.obstacle.x, Config.p5.obstacle.y, Config.p5.obstacle.w, Config.p5.obstacle.h);
    goalX = Config.p5.goal.x;
    goalY = Config.p5.goal.y;
    isGoalSet = true;
    population = new Population(p, goalX, goalY, obstacle);
  };

  p.draw = () => {
    p.background(Config.p5.background);
    obstacle.show();

    if (isGoalSet) {
      p.fill(Config.p5.goalColor);
      p.ellipse(goalX, goalY, Config.goalRadius, Config.goalRadius);
      population.showRockets(count);
      count += 1;
      if (count === Config.lifespan) {
        population.evolve();
        count = 0;
      }

      lifespan.html("Lifespan: " + count + " / " + Config.lifespan);
      generation.html("Generation: " + population.generation);
      if (population.mostFit.bestFit) bestFit.html("Closest Distance achieved: " + population.mostFit.bestFit.d)
    }
  };
}