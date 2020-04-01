import Config from "../app_config";
import Population from "../ga/Population";

export default function Sketch(p) {
  let isGoalSet = false;
  let goalX;
  let goalY;
  let population;
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

    goalX = Math.floor(Math.random() * Config.p5.canvasWidth);
    goalY = Math.floor(Math.random() * Config.p5.canvasWidth);
    isGoalSet = true;
    population = new Population(p, goalX, goalY);
  };

  p.draw = () => {
    p.background(Config.p5.background);

    if (isGoalSet) {
      p.fill(Config.p5.goalColor);
      p.noStroke();
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