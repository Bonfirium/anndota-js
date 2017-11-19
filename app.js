
const fs = require('fs')
const config = require('./config.json')
const numeral = require('numeral')
const Ann = require('./ann')
const util = require('util')
const games = require(config.pathDataset.games)
const heroes = require(config.pathDataset.heroes)
const Utils = require('./utils')

let checker_interval = 1000//Math.floor(Math.random( ) * 1000) + 500

const gamesCount = Object.keys(games).length

let ann = new Ann(230, [ 230 ], 1, true)

let testNumber = 0
let iter = 0
let rightAnswers = 0

let out = ""
let maxRA = 0

for (let repeat = 0; repeat < 2; repeat++) {

    for (let gameID in games) {
        // if (gameID < 3535000223) continue
        let game = games[gameID]
        let input = [ ]
        for (let i = 0; i < ann.InputsCount; i++) {
            input[i] = 0
        }
        let pick = game.radiantPick.concat(game.direPick)
        try {
            pick.forEach(function(slot, slotIndex) {
                input[heroes[slot.hero].ann_index + (slotIndex < 5 ? 0 : ann.InputsCount / 2)] = 0.5
            }, this)
        } catch (e) {
            continue
        }
        let answerForLearning = 0.5 + (game.winner == 'radiant' ? 1 : -1) * (game.advantage - 0.5)
        let realAnswer = ann.Start(input, [ answerForLearning ], 0.7, 0.3)[0]
        // console.log(realAnswer)
        // let realAnswer = ann.Run(input)[0]
        // console.log(ann)
        // console.log(realAnswer)
        // console.log(answerForLearning)
        if (Math.round(realAnswer) == (game.winner == 'radiant' ? 1 : 0)) {
            rightAnswers++
        }
        testNumber++
        iter++
        if (iter == checker_interval) {
            let d = rightAnswers / checker_interval
            let str = numeral(d * 100).format('00.0') + '%'
            out += (out.length == 0 ? '' : ':') + str
            if (maxRA < d) {
                fs.writeFileSync('E:/anndata/' + testNumber + '.txt', out, 'utf8')
                maxRA = d
            }
            console.log(Utils.allignRight(testNumber + '.', 8) + str)
            iter = 0
            rightAnswers = 0
            checker_interval = 1000//Math.floor(Math.random( ) * 1000) + 500
        }
    }
}

console.log('Done!')
console.log(numeral(rightAnswers / CHECKER_INTERVAL * 100).format('00.0%'))
