import Config from "../../app_config";

export default class Slot {
  constructor(p, i, j, isFilled = false) {
    //p5
    this.p = p;
    this.sConf = Config.slot;
    this.i = i;
    this.j = j;
    this.w = this.sConf.w;
    this.h = this.sConf.h;
    this.x = j * this.w;
    this.y = i * this.h;

    //gameLogic
    this.isFilled = isFilled;
  }

  setCoordinates = (i, j) => {
    this.i = i;
    this.j = j;
    this.x = j * this.w;
    this.y = i * this.h;
  };

  show = () => {
    let {p, sConf, x, y, w, h} = this;

    if (this.isFilled) p.fill(sConf.filledColor);
    else p.fill(sConf.color);
    p.rect(x, y, w, h);
  }
}