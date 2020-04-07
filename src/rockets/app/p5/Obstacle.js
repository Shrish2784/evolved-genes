import Config from "../app_config";

export default class Obstacle {
  constructor(p, x, y, w, h) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  /**
   * Display obstacle.
   */
  show = () => {
    this.p.stroke(Config.p5.obstacle.color);
    this.p.fill(Config.p5.obstacle.color);
    this.p.rectMode(this.p.CORNER);
    this.p.rect(this.x, this.y, this.w, this.h);
  }
}