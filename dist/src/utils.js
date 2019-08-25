"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const ncrypt_1 = __importDefault(require("./ncrypt"));
/**
 * crypto random key generated from core node {crypto} module
 */
const key = crypto_1.default.randomBytes(32);
/**
 * crypto random initial vector generated from core node {crypto} module
 */
const initialVector = crypto_1.default.randomBytes(16);
/**
 * secret key {salt}
 */
let _secret;
/**
 * sets the value of the salt to secret
 * @param {secret.<string>} secret
 */
const setSecret = (secret) => {
    _secret = secret;
};
/**
 *
 * @param {text.<object, string, *>} text
 * @param {salt.<string>} salt
 * @returns {data.<string>} crypto-cipher encrypted data and concatenated initial vector string
 */
const encrypt = function (text, salt) {
    if (text === null)
        throw new Error('no data was entered, enter data of type object, number, string or boolean to be encrypted.');
    setSecret(salt);
    const data = JSON.stringify(text);
    if (typeof salt !== 'string')
        throw new Error('must be initialized with a secret key of type string');
    /**
     * ncrypt constructor with initial data and secret {salt}
     */
    const encryptObject = new ncrypt_1.default(data, salt);
    const encoded = encryptObject.encodeData();
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(key), initialVector);
    let encrypted = cipher.update(encoded);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    /**
     * concatenated data and vector string
     */
    return `${initialVector.toString('hex')}.${encrypted.toString('hex')}`;
};
exports.encrypt = encrypt;
/**
 * decrypt crypto-ciphered data and vector
 * @param {encodedData.<any>} encodedData
 * @returns {string.<string>} decrypted text
 */
const decrypt = function (encodedData) {
    const encryptObject = new ncrypt_1.default(encodedData, _secret);
    const decryptionInitialVector = encodedData.split('.')[0];
    const encodedText = encodedData.split('.')[1];
    const _iv = Buffer.from(decryptionInitialVector, 'hex');
    const encryptedText = Buffer.from(encodedText, 'hex');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(key), _iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(encryptObject.decodeData(decrypted.toString()));
};
exports.decrypt = decrypt;
