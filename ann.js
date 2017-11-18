'use strict'

const util = require('util')

class Ann {
    constructor(input_neurons_count, hidden_levels_dimensions, output_neurons_count, use_bias_neurons = true) {
        this.weights = [ ]
        this.changing = [ ]
        this.gradients = [ ]
        this.inputs = [ ]
        this.outputs = [ ]
        this.deltas = [ ]
        for (let i = 0, iTo = hidden_levels_dimensions.length + 1, iPrev = undefined; i < iTo; iPrev = i, i++) {
            this.weights.push([ ])
            this.changing.push([ ])
            this.gradients.push([ ])
            this.inputs.push([ ])
            this.outputs.push([ ])
            this.deltas.push([ ])
            for (let j = 0, jTo = (i == 0 ? input_neurons_count : hidden_levels_dimensions[iPrev]), jNext = 1; j < jTo;
                j = jNext, jNext++) {
                this.weights[i].push([ ])
                this.changing[i].push([ ])
                this.gradients[i].push([ ])
                this.inputs[i].push(0)
                this.outputs[i].push(0)
                this.deltas[i].push(0)
                for (let k = 0, kTo =
                    (i == hidden_levels_dimensions.length ? output_neurons_count : hidden_levels_dimensions[i]);
                    k < kTo; k++) {
                    this.weights[i][j].push(Math.random( ) - 0.5)
                    this.changing[i][j].push(0)
                    this.gradients[i][j].push(0)
                }
            }
        }
        this.inputs.push([ ])
        this.outputs.push([ ])
        this.deltas.push([ ])
        for (let i = 0, valuesLastIndex = this.inputs.length - 1; i < output_neurons_count; i++) {
            this.inputs[valuesLastIndex].push(0)
            this.outputs[valuesLastIndex].push(0)
            this.deltas[valuesLastIndex].push(0)
        }
        if (use_bias_neurons) {
            this.bias_neurons = [ ]
            for (let i = 0; i <= hidden_levels_dimensions.length; i++) {
                this.bias_neurons.push([ ])
                for (let j = 0, jTo =
                    (i == hidden_levels_dimensions.length ? output_neurons_count : hidden_levels_dimensions[i]);
                    j < jTo; j++) {
                    this.bias_neurons[i].push(Math.random( ) - 0.5)
                }
            }
        }
    }

    get InputsCount( ) {
        return this.inputs[0].length
    }

    get LayersCount( ) {
        return this.inputs.length
    }

    get LastLayer( ) {
        return this.LayersCount - 1
    }

    Run(input_signals, run_function = Ann.Sigmoid) {
        for (let i = 0; i < this.InputsCount; i++) {
            this.outputs[0][i] = input_signals[i]
        }
        for (let i = 1, iPrev = 0; i < this.LayersCount; iPrev = i, i++) {
            for (let j = 0; j < this.inputs[i].length; j++) {
                this.inputs[i][j] = 0
                for (let k = 0; k < this.inputs[iPrev].length; k++) {
                    this.inputs[i][j] += this.outputs[iPrev][k] * this.weights[iPrev][k][j]
                }
                if (this.bias_neurons) {
                    this.inputs[i][j] += this.bias_neurons[i - 1][j]
                }
                this.outputs[i][j] = run_function(this.inputs[i][j])
            }
        }
        return this.outputs[this.LastLayer]
    }

    Learn(ideal_results, learning_speed = 0.7, learning_moment = 0.3,
        learn_function = Ann.SigmoidDerivativeSimplified) {
        for (let i = 0; i < this.inputs[this.LastLayer].length; i++) {
            this.deltas[this.LastLayer][i] =
                (ideal_results[i] - this.outputs[this.LastLayer][i]) * learn_function(this.inputs[this.LastLayer][i])
        }
        for (let i = this.LastLayer - 1; i > 0; i--) {
            for (let j = 0; j < this.inputs[i].length; j++) {
                this.deltas[i][j] = learn_function(this.inputs[i][j])
                let sum = 0
                for (let k = 0, iNext = i + 1; k < this.inputs[iNext].length; k++) {
                    sum += this.weights[i][j][k] * this.deltas[iNext][k]
                }
                this.deltas[i][j] *= sum
            }
        }
        for (let i = this.LastLayer - 1; i >= 0; i--) {
            for (let j = 0; j < this.inputs[i].length; j++) {
                for (let k = 0, iNext = i + 1; k < this.inputs[iNext].length; k++) {
                    this.gradients[i][j][k] = this.deltas[iNext][k] * this.outputs[i][j]
                    let newChanging =
                        learning_speed * this.gradients[i][j][k] + learning_moment * this.changing[i][j][k]
                    this.changing[i][j][k] = newChanging
                    this.weights[i][j][k] += newChanging
                }
            }
        }
    }

    static Sigmoid(x) {
        return 1 / (1 + Math.exp(-x))
    }

    static SigmoidDerivativeSimplified(x) {
        return x * (1 - x)
    }
}

module.exports = Ann
