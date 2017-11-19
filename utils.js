'use strict'

class Utils {
    static allignRight(str, len) {
        str = String(str)
        while (str.length < len) {
            str = ' ' + str
        }
        return str
    }
    static getRandomHash(length = 64) {
        let result = ''
        var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for (let i = 0; i < length; i++) {
            result += possibleChars.charAt(Math.floor(Math.random( ) * possibleChars.length))
        }
        return result
    }

    constructor( ) {
        throw 'static class'
    }
}

module.exports = Utils
