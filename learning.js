
const fs = require('fs')
const random_seed = require('random-seed')
const numeral = require('numeral')

const Ann = require('./ann')
const games = require('./datasets/data/games.json')
const heroes = require('./datasets/data/heroes.json')
const Utils = require('./utils')

const GAMES_COUNT = Object.keys(games).length

const BEST_ANN_PATH = 'out/bestAnn.json'
const LOG_INTERVAL = 1000

let bestResult
let bestAnnJSON
if (fs.existsSync(BEST_ANN_PATH)) {
    bestAnnJSON = require('./' + BEST_ANN_PATH)
    bestResult = bestAnnJSON.prediction
} else {
    bestResult = 0
}

while (true) {
    let hash = Utils.getRandomHash(16)
    console.log( )
    console.log('ann-hash = ' + hash)
    let random = random_seed.create(hash)
    let ann = new Ann(230, [ 261 , 131 ], 1, true, random)
    let learningSpeed = random.random( ) * 1.4 + 0.3
    console.log('learningSpeed: ' + learningSpeed)
    let learningMoment = random.random( ) * 0.6 + 0.3
    console.log('learningMoment: ' + learningMoment)
    let testNumber, rightAnswers
    for (let repeat = 0; repeat < 3; repeat++) { // два для обучения, один для тестирования
        let isInLearning = repeat == 3
        if (isInLearning) {
            console.log('Learning #' + repeat)
        } else {
            console.log('TESTING')
        }
        testNumber = 0
        rightAnswers = 0
        for (let gameID in games) {
            if (gameID < 3535000223) continue // не учитывать игры до последнего патча
            let game = games[gameID]
            let input = [ ]
            for (let i = 0; i < ann.InputsCount; i++) {
                input[i] = 0
            }
            let pick = game.radiantPick.concat(game.direPick)
            try {
                pick.forEach(function(slot, slotIndex) {
                    input[heroes[slot.hero].ann_index + (slotIndex < 5 ? 0 : ann.InputsCount / 2)] = 1
                }, this)
            } catch (e) {
                continue
            }
            let answerForLearning = 0.5 + (game.winner == 'radiant' ? 1 : -1) * (game.advantage - 0.5)
            let realAnswer = isInLearning ? ann.Start(input, [ answerForLearning ], 0.9, 0.4)[0] : ann.Run(input)
            if (Math.round(realAnswer) == (game.winner == 'radiant' ? 1 : 0)) {
                rightAnswers++
            }
            testNumber++
            if (testNumber % LOG_INTERVAL == 0) {
                let d = rightAnswers / testNumber
                console.log(Utils.allignRight(testNumber + '.', 8) + '   ' + numeral(d * 100).format('00.0') + '%')
                if (isInLearning) {
                    rightAnswers = 0
                    testNumber = 0
                }
            }
        }
    }
    let result = rightAnswers / testNumber
    console.log('DONE!')
    console.log('PREDICTION = ' + numeral(result * 100).format('00.0000%'))
    if (result > bestResult) {
        console.log( )
        console.log('It\' RECORD!!!')
        console.log('ANN is saved')
        console.log( )
        bestResult = result
        bestAnnJSON = {
            "prediction": result,
            "ann": ann.toJSON( )
        }
        fs.writeFileSync(BEST_ANN_PATH, JSON.stringify(bestAnnJSON))
    }
}
