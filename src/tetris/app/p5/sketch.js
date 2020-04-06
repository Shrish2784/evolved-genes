import Config from "../app_config";
import Bot from "../ga/Bot";
import {getNewTetrimino} from "../helper";

export default function Sketch(p) {
  let bots = [];
  let currentTetrimino;
  let nextTetrimino;
  let areAllBotsDead = false;
  let bestBotIndex = 0;
  let maxFitness = 0;
  let generation = 0;
  let bestBot = null;

  let botNumP;
  let genP;
  let fitnessP;
  let paramsP;

  //==================================================GA==========================================================
  let calcFitnessRatio = () => {
    let maxFit = 0;
    console.log("=========================================");
    bots.forEach(bot => {
      if (bot.fitness > maxFit) {
        maxFit = bot.fitness;
        bestBot = bot;
      }
      console.log(bot.fitness);
    });
    console.log("=========================================");
    bots.forEach(bot => bot.fitnessRatio = bot.fitness / maxFit);
  };

  let generateMatingPool = () => {
    let pool = [];
    bots.forEach(bot => {
      for (let i = 0; i < (bot.fitnessRatio * 100); i++) pool.push(bot);
    });
    return pool;
  };

  let crossOver = (bot1, bot2) => {
    let bot = new Bot(p);

    let sum = 0;
    for (let i = 0; i < 4; i++) {
      bot1.params[i] *= bot1.fitness;
      bot2.params[i] *= bot2.fitness;
      bot.params[i] = bot1.params[i] + bot2.params[i];
      sum += (bot.params[i] * bot.params[i]);
    }
    console.log(bot.params, sum);

    let n = Math.sqrt(sum);
    for (let i = 0; i < 4; i++) bot.params[i] = bot.params[i] / n;
    return bot;
  };

  let mutate = (bot) => {
    if (Math.random() <= Config.mutationRate) {
      // bot.params[0] += 0.05;
      // bot.params[1] -= 0.05;
      // bot.params[2] -= 0.05;
      // bot.params[3] -= 0.05;
    }
  };

  let nextGen = () => {
    generation += 1;
    let bots = [];
    calcFitnessRatio();
    let pool = generateMatingPool();
    for (let i = 0; i < Config.popSize; i++) {
      let newBot = crossOver(p.random(pool), p.random(pool));
      mutate(newBot);
      bots.push(newBot);
    }
    return bots;
  };

  //====================================================P5==========================================================
  p.setup = () => {
    p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);
    currentTetrimino = getNewTetrimino();
    nextTetrimino = getNewTetrimino();
    for (let i = 0; i < Config.popSize; i++) bots.push(new Bot(p));
    p.frameRate(100);
    botNumP = p.createP();
    genP = p.createP();
    fitnessP = p.createP();
    paramsP = p.createP();
  };

  p.draw = () => {
    if (!areAllBotsDead) {
      p.background(Config.p5.background);
      let deadBotsCount = 0;
      let tetriminoDoneCount = 0;
      bots.forEach((bot, botIndex) => {
        if (!bot.isDead && !currentTetrimino.isDecided) bot.decide(currentTetrimino, nextTetrimino);
        if (!bot.isDead) tetriminoDoneCount += (bot.play(currentTetrimino)) ? 1 : 0;
        else tetriminoDoneCount += 1;

        if (bot.fitness > maxFitness) {
          bestBotIndex = botIndex;
          maxFitness = bot.fitness;
        }
        deadBotsCount += (bot.isDead) ? 1 : 0;
      });

      bots[bestBotIndex].show(currentTetrimino);
      botNumP.html("Current Bot Index: " + bestBotIndex);
      genP.html("Generation: " + generation);

      currentTetrimino.isDecided = true;

      areAllBotsDead = deadBotsCount === bots.length;
      currentTetrimino.isDone = tetriminoDoneCount === bots.length;

      if (generation > 0) {
        fitnessP.html("Best fitness last generation: " + bestBot.fitness);
        paramsP.html("Best params: [" + bestBot.params[0] + ", " + bestBot.params[1] + ", " + bestBot.params[2] + ", " + bestBot.params[3] + "]")
      }

      if (currentTetrimino.isDone) {
        currentTetrimino = nextTetrimino;
        nextTetrimino = getNewTetrimino();
      } else currentTetrimino.i += 1;
    } else {
      p.background(Config.p5.background);
      bots = nextGen();
      currentTetrimino = getNewTetrimino();
      nextTetrimino = getNewTetrimino();
      areAllBotsDead = false;
      maxFitness = 0;
    }
  }
}