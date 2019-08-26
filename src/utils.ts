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
let _secret: string, exitProcess = process.exit;


/**
 * sets the value of the secret
 * @param {secret.<string>} secret
 */
const setSecret = (secret: string) => {
  _secret = secret;
}

/**
 * intermediate data encoder function
 * @param string 
 * @param secret
 * @returns {object} encrypted, cipher
 */
const encoder = (string: string, secret: string) => {
  const encryptObject: Ncrypt = new Ncrypt(string, secret);
  const encoded: string = encryptObject.encodeData();
  const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), initialVector);
  let encrypted: Buffer = cipher.update(encoded);
  return { encrypted, cipher };
}

/**
 * intermediate data decoder function
 * @param string 
 * @param secret
 * @returns {object} encrypted, cipher
 * @throws {Error} Error
 */
const decoder = (decryptionInitialVector: string, encodedText: string) => {
  try {
    const _iv: Buffer = Buffer.from(decryptionInitialVector, 'hex');
    const encryptedText: Buffer = Buffer.from(encodedText, 'hex');
    const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), _iv);
    let decrypted: Buffer = decipher.update(encryptedText);
    return { decrypted, decipher };
  } catch (error) {
    throw new Error('argument must be a string, or a string-like object');
  }
}

/**
 * 
 * @param {text.<object, string, *>} text
 * @param {secret.<string>} secret
 * @returns {data.<string>} crypto-cipher encrypted data and concatenated initial vector string
 */
const encrypt = (data: object | string | number | boolean, secret: string) => {
  if (data === null) throw new Error('no data was entered, enter data of type object, number, string or boolean to be encrypted.');
  setSecret(secret);
  const string: string = JSON.stringify(data);
  if (typeof secret !== 'string') throw new Error('must be initialized with a secret key of type string');

  /**
   * ncrypt constructor with initial data and secret {secret}
   */
  let { encrypted, cipher }: { encrypted: Buffer; cipher: crypto.Cipher } = encoder(string, secret);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  /**
   * concatenated data and vector string
   */
  return `${initialVector.toString('hex')}.${encrypted.toString('hex')}`;
}

/**
 * decrypt crypto-ciphered data and vector
 * @param {encodedData.<any>} encodedData
 * @returns {string.<string>} decrypted data
 */
const decrypt = (encodedData: string) => {
  if (typeof encodedData !== 'string') {
    throw new TypeError('argument must be a string, or a string-like object');
  }
  const encryptObject: Ncrypt = new Ncrypt(encodedData, _secret);
  const decryptionInitialVector = encodedData.split('.')[0];
  const encodedText = encodedData.split('.')[1];

  let { decrypted, decipher }: { decrypted: Buffer; decipher: crypto.Decipher; } = decoder(decryptionInitialVector, encodedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  /**
   * JSON parsed decrypted text buffer
   */
  return JSON.parse(encryptObject.decodeData(decrypted.toString()));
}

export { encrypt, decrypt };
