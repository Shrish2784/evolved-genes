export default class Vector {
  constructor() {
    this.vector = [];

    this.vector.push(Math.random());
    this.vector.push(Math.random());
    this.vector.push(Math.random());
    this.vector.push(Math.random());

    this.fitness = 1;
  }
}