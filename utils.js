'use strict'

class Utils {
    static allignRight(str, len) {
        str = String(str)
        while (str.length < len) {
            str = ' ' + str
        }
        return str
    }

    constructor( ) {
        throw 'static class'
    }
}

module.exports = Utils
