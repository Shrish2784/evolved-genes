import Config from "../app_config";

export default class Pipe {
  constructor(p5) {
    this.p = p5;
    this.pConf = Config.p5.pipe;
    this.x = this.pConf.x;
    this.cH = Config.p5.canvasHeight;
    this.top = Math.random();
    this.bottom = Math.random();
    this.isInFrame = true;
    this.isBehindFlupper = false;
    this.calibratePipes();
  }

  calibratePipes = () => {
    let {top, bottom, pConf} = this;
    if ((top + bottom) > (1 - pConf.minGap)) {
      let d = (top + bottom) - (1 - pConf.minGap);
      top -= d / 2;
      bottom -= d / 2;
    }
    this.top = top;
    this.bottom = bottom;
  };

  update = () => {
    this.x -= Config.speed;
    if (this.x <= -this.pConf.width) this.isInFrame = false;
    if ((this.x + this.pConf.width) < Config.p5.flupper.x) this.isBehindFlupper = true;
  };

  show = () => {
    let {p, pConf, top, bottom, cH, x} = this;
    p.stroke(0);
    p.strokeWeight(5);
    if (this.isBehindFlupper) p.fill(pConf.behindFlupperColor);
    else p.fill(pConf.color);
    p.rect(x, 0, pConf.width, (top * cH));
    p.rect(x, (cH - (bottom * cH)), pConf.width, cH);
  }
}