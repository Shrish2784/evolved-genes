import Config from "../app_config";

const synaptic = require("synaptic");

export default class Brain {
  constructor() {
    this.input = new synaptic.Layer(Config.nn.inputNodes);
    this.hidden = new synaptic.Layer(Config.nn.hiddenNodes);
    this.output = new synaptic.Layer(Config.nn.outputNodes);

    this.input.project(this.hidden);
    this.hidden.project(this.output);
    this.network = new synaptic.Network({
      input: this.input,
      hidden: [this.hidden],
      output: this.output
    })
  }

  activate = (inputs) => {
    return this.network.activate(inputs);
  };

  mutate = () => {
    if (Math.random() <= Config.mutationRate) {
      // TODO: Add mutation logic
      // console.log(this.network.layers.input.connectedTo[0]);
    }
  }

}