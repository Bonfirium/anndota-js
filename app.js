'use strict'

const Ann = require('./ann')
const util = require('util')

let ann = new Ann(2, [ 2 ], 1, false)
console.log(util.inspect(ann, { colors: true, depth: null }))
let res = ann.Run([0.78, 0.32])
console.log(res)
ann.Learn([0.32])
console.log(util.inspect(ann, { colors: true, depth: null }))
