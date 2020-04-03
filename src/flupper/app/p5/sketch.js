import Config from "../app_config";
import Pipe from "./Pipe";
import Population from "../ga/Population";

export default function Sketch(p) {
  //p5
  let pConfig = Config.p5;
  let pipes = [];
  let counter = 1;
  let score = 0;
  let scoreP;
  let completedGen = false;
  let slider;

  //ga
  let population;
  let generationP;
  let bestScoreP;
  let bestTillNowP;

  p.setup = () => {
    p.createCanvas(pConfig.canvasWidth, pConfig.canvasHeight);
    pipes.push(new Pipe(p));
    scoreP = p.createP();

    p.createP("Population size: " + Config.popSize);
    p.createP("Mutation Rate: " + Config.mutationRate);
    generationP = p.createP();
    bestScoreP = p.createP();
    bestTillNowP = p.createP();

    slider = p.createSlider(1, 1000, 1, 20);

    population = new Population(p);
  };

  p.draw = () => {
    for (let s = 1; s <= slider.value(); s++) {
      if (!completedGen) {
        p.background(pConfig.background);

        //New Pipe
        counter += 1;
        if (counter % Config.frames === 0) {
          pipes.push(new Pipe(p));
          counter = 1;
        }

        //Pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].update();
          pipes[i].show();
          if (!pipes[i].isInFrame) {
            pipes.splice(i, 1);
            score += 1;
          }
        }

        //Fluppers
        population.showFluppers(pipes, score);
        completedGen = population.isAllDead;

        //Score
        scoreP.html(score);
      } else {
        population.nextGeneration();
        generationP.html("Generation: " + population.generation);
        bestScoreP.html("Best score this generation: " + population.bestFlupper.score);
        bestTillNowP.html("Best score achieved in all generations: " + population.bestFlupperTillNow.score);
        score = 0;
        counter = 1;
        pipes = [];
        pipes.push(new Pipe(p));
        completedGen = population.isAllDead;
      }
    }
  }
};