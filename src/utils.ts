import crypto from 'crypto';
import Ncrypt from './ncrypt';

/**
 * crypto random key generated from core node {crypto} module
 */
const key: Buffer = crypto.randomBytes(32);

/**
 * crypto random initial vector generated from core node {crypto} module
 */
const initialVector: Buffer = crypto.randomBytes(16);

/**
 * secret key {secret}
 */
let _secret: string;


/**
 * sets the value of the secret
 * @param {secret.<string>} secret
 */
const setSecret = (secret: string) => {
  _secret = secret;
}

/**
 * 
 * @param {text.<object, string, *>} text
 * @param {secret.<string>} secret
 * @returns {data.<string>} crypto-cipher encrypted data and concatenated initial vector string
 */
const encrypt = function (text: object | string | number | boolean, secret: string) {
  if (text === null) throw new Error('no data was entered, enter data of type object, number, string or boolean to be encrypted.');
  setSecret(secret);
  const data: string = JSON.stringify(text);
  if (typeof secret !== 'string') throw new Error('must be initialized with a secret key of type string');
  
  /**
   * ncrypt constructor with initial data and secret {secret}
   */
  const encryptObject: Ncrypt = new Ncrypt(data, secret);
  const encoded: string = encryptObject.encodeData();
  const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), initialVector);
  let encrypted: Buffer = cipher.update(encoded);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  /**
   * concatenated data and vector string
   */
  return `${initialVector.toString('hex')}.${encrypted.toString('hex')}`;
}

/**
 * decrypt crypto-ciphered data and vector
 * @param {encodedData.<any>} encodedData
 * @returns {string.<string>} decrypted text
 */
const decrypt: any = function (encodedData: string) {
  const encryptObject: Ncrypt = new Ncrypt(encodedData, _secret);
  const decryptionInitialVector = encodedData.split('.')[0];
  const encodedText = encodedData.split('.')[1];
  
  const _iv: Buffer = Buffer.from(decryptionInitialVector, 'hex');
  const encryptedText: Buffer = Buffer.from(encodedText, 'hex');
  const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), _iv);
  let decrypted: Buffer = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  /**
   * JSON parsed decrypted text buffer
   */
  return JSON.parse(encryptObject.decodeData(decrypted.toString()));
}

export { encrypt, decrypt };
