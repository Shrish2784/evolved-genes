import Config from "../../app_config";

export default class Slot {
  constructor(p, i, j, isFilled = false) {
    this.p = p;
    this.i = i;
    this.j = j;
    this.w = Config.slot.w;
    this.h = Config.slot.h;
    this.x = j * this.w;
    this.y = i * this.h;

    /**
     * Default Color of every slot
     * @type {string}
     */
    this.color = Config.slot.color;

    /**
     * Has a tetrimino slot placed on it or not.
     * @type {boolean}
     */
    this.isFilled = isFilled;
  }

  /**
   * Display the slot.
   */
  show = () => {
    let {p, x, y, w, h} = this;
    p.push();
    p.translate(x, y);
    // p.noStroke();
    p.fill(this.color);
    p.rect(0, 0, w, h);
    p.pop();
  }
}