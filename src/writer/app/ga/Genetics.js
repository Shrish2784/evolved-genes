import Config from "./config"
import Population from "./Population";

export default function Sketch(p) {
  p.setup = () => {
    p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);
    p.fill(Config.p5.textColor);
    p.textSize(Config.p5.textSize);
    p.background(Config.p5.backgroundColor);
  };

  p.draw = () => {
    let step = 0;
    p.background(Config.p5.backgroundColor);

    if (Genetics.loop) {
      step = Genetics.write(p, step, 4, `
      Target: ${Genetics.target}
      Population Size: ${Config.popSize}
      Mutation Rate: ${Config.mutationRate}
      `);

      step = Genetics.write(p, step, 2, `
      Generation: ${Genetics.population.generation}
      `);

      Genetics.population.calculateFitness();
      let bestFit = Genetics.population.getBestFit();

      step = Genetics.write(p, step, 3, `
      Best Fit: ${bestFit.dna}
      Best Fitness: ${bestFit.fitness}
      `);

      if (bestFit.fitness !== 1) {
        Genetics.population.generateNextGeneration();
      }
    }
  };
}


export class Genetics {
  static loop = false;
  static target = null;
  static population;

  static init(target) {
    Genetics.loop = true;
    Genetics.target = target;
    Genetics.population = new Population(Config.popSize, target);
  }

  static reset() {
    Genetics.loop = false;
  }

  static write = (p, step, lines, text, align = p.LEFT) => {
    p.textAlign(align, p.TOP);
    p.text(text, 0, step * Config.p5.lineGap);

    return step + lines;
  };
}