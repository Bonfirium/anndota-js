
const Ann = require('./ann')

let ann = new Ann(2, [ 2 ], 1, false)
ann.weights[0][0][0] = 0.45
ann.weights[0][0][1] = 0.78
ann.weights[0][1][0] = -0.12
ann.weights[0][1][1] = 0.13
ann.weights[1][0][0] = 1.5
ann.weights[1][1][0] = -2.3

console.log(ann.Start([1, 0], [ 1 ])[0])
