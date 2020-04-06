import Config from "../app_config";
import Bot from "../ga/Bot";
import Tetrimino from "../component/objects/Tetrimino";

export default function Sketch(p) {
  let bots = [];
  let currentTetrimino;
  let nextTetrimino;
  let areAllBotsDead = false;
  let bestBot = 0;

  let getNewTetrimino = () => new Tetrimino(1);

  p.setup = () => {
    p.createCanvas(Config.p5.canvasWidth, Config.p5.canvasHeight);
    currentTetrimino = getNewTetrimino();
    nextTetrimino = getNewTetrimino();
    for (let i = 0; i < Config.popSize; i++) bots.push(new Bot(p));
    p.frameRate(10);
  };

  p.draw = () => {
    if (!areAllBotsDead) {
      p.background(Config.p5.background);
      let deadBotsCount = 0;
      let tetriminoDoneCount = 0;
      bots.forEach(bot => {
        if (!bot.isDead && !currentTetrimino.isDecided) bot.decide(currentTetrimino, nextTetrimino);
        if (!bot.isDead) tetriminoDoneCount += (bot.play(currentTetrimino)) ? 1 : 0;
        else tetriminoDoneCount += 1;

        deadBotsCount += (bot.isDead) ? 1 : 0;
      });
      bots[bestBot].show(currentTetrimino);
      currentTetrimino.isDecided = true;

      areAllBotsDead = deadBotsCount === bots.length;
      currentTetrimino.isDone = tetriminoDoneCount === bots.length;
      if (currentTetrimino.isDone) {
        currentTetrimino = nextTetrimino;
        nextTetrimino = getNewTetrimino();
      } else currentTetrimino.i += 1;
    }
  }
}