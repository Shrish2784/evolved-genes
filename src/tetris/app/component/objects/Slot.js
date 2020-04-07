import Config from "../../app_config";

export default class Slot {
  constructor(p, i, j, isFilled = false) {
    //p5
    this.p = p;
    this.i = i;
    this.j = j;
    this.w = Config.slot.w;
    this.h = Config.slot.h;
    this.x = j * this.w;
    this.y = i * this.h;
    this.color = Config.slot.color;

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
    let {p, x, y, w, h} = this;
    p.noStroke();
    p.fill(this.color);
    p.rect(x, y, w, h);
  }
}