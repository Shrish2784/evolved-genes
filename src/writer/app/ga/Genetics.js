import Config from "./config"
import Population from "./Population";

/**
 * P5 Sketch object.
 */
export default function Sketch(p) {
  p.setup = () => {
    p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);
    p.fill(Config.p5.textColor);

    /**
     * The text size of the lines on canvas.
     */
    p.textSize(Config.p5.textSize);
    p.background(Config.p5.backgroundColor);
  };

  p.draw = () => {
    // eslint-disable-next-line no-unused-vars
    let step = 0;
    p.background(Config.p5.backgroundColor);

    /**
     * Write the data related to the Algorithm.
     */
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

  /**
   * If true, P5 loops through the Draw, else doesn't.
   */
  static loop = false;

  /**
   * Target entered by the user, The aim of the Genetic algorithm.
   */
  static target = null;

  /**
   * Population of random DNAs taking part in the Genetic algorithm.
   */
  static population;


  /**
   * Initialization of the Target and the population.
   * @param target
   */
  static init(target) {
    Genetics.loop = true;
    Genetics.target = target;
    Genetics.population = new Population(Config.popSize, target);
  }

  /**
   * This stops the loop, and allows user to enter the next Target.
   */
  static reset() {
    Genetics.loop = false;
  }

  /**
   * Writes data to the canvas on the screen.
   * @param p  P5 Object
   * @param step  Line Number
   * @param lines  Number of Lines to Write
   * @param text  Actual text of the lines
   * @param align  Alignment of the lines
   *
   * @returns {*} The next Line number available to write lines from.
   */
  static write = (p, step, lines, text, align = p.LEFT) => {
    p.textAlign(align, p.TOP);
    p.text(text, 0, step * Config.p5.lineGap);

    return step + lines;
  };
}