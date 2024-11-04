'use strict'

const defaultAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function nanoid(length, alphabet = defaultAlphabet) {
    let result = '';
    const alphabetLength = alphabet.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphabetLength);
        result += alphabet[randomIndex];
    }
    return result;
}

module.exports.nanoid = nanoid
