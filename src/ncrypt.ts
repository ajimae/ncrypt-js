import * as crypto from 'crypto';

type TNCRYPT_ENC = 'base64' | 'binary' | 'hex' | 'ucs-2' | 'ucs2' | 'utf16le';

/**
 * @class Ncrypt
 * @type {Ncrypt.<object>}
 */
export default class Ncrypt {
  /**
   * encryption secret.
   * @type {secret.<string>} secret
   */
  private secret: string;

  /**
   * algorithm used for encoding message
   */
  private readonly algorithm = 'aes-256-cbc';

  /**
   * ecoding for encrypted stirng
   */
  private readonly enc = (process.env.NCRYPT_ENC) as TNCRYPT_ENC || 'hex';

  /**
   * crypto random initial vector generated from core node {crypto} module
   */
  private readonly initialVector: Buffer = crypto.randomBytes(16);

  /**
   * crypto random key generated from core node {crypto} module
   * {note}: please read the value for KEY from your app's environment
   */
  private readonly key: Buffer = crypto.scryptSync(
    process.env.KEY || 'please provide a KEY in your .env file or config',
    'salt',
    32
  );

  /**
   * object constructor
   * @param {secret.<string>} secret
   */
  constructor(secret: string) {
    this.secret = secret;

    // bind public instnace methods
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
  }

  /**
   * convert all entered text to decimal equivalent character codes
   * @param {text.<string>} text to be converted
   * @return {Array.<number>} array of character codes
   */
  private convertTextToDecimal = (text: string): number[] => {
    return text.split('').map((value) => value.charCodeAt(0));
  }

  /**
   * encode provided secret on decimal character codes
   * @param {charCode.<number, number[]>} charCodes
   * @returns {*.<number>} decimal string
   */
  private applySecretToCharacters = (charCodes: number | number[]): number => {
    return this.convertTextToDecimal(this.secret)
      .reduce((firstValue: number, secondValue: number) => (firstValue ^ secondValue), charCodes as number)
  }

  /**
   * convert character bytes to hexadecimal equivalent
   * @param {number.<number>} number
   * @returns {*.<string>} hexadecimal string
   */
  private convertByteToHexadecimal = (number: number): string => {
    return ('0' + Number(number).toString(16)).substr(-2);
  }

  /**
   * intermediate data encoder function
   * @param {string.<any>} text
   * @param secret
   * @returns {string} encrypted or cipher text
   */
  private encode = (text: string): string => {
    let cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.initialVector);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${this.initialVector.toString(this.enc)}.${encrypted.toString(this.enc)}`;
  }

  /**
   * intermediate data decoder function
   * @param {string.<any>} text
   * @returns {string.<string>} decrypted data
   */
  private decode = (text: string): string => {
    if (typeof text !== 'string') {
      throw new TypeError('argument must be a string, or a string-like object');
    }

    const iv = text.split('.')[0];
    const encryptedData = text.split('.')[1];

    let _iv = Buffer.from(iv, this.enc);
    let encryptedText = Buffer.from(encryptedData, this.enc);
    let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), _iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  /**
   * generate random strings
   * @example
   *
   * var fs = require('fs');
   * var ncrypt = require('ncrypt-js');
   *
   * console.log(ncrypt.randomString(8, 'base64')); // g3lzZ48TW6w==
   *
   * @param {size.<number>} size
   * @param {enc.<string>} enc
   * @returns {*.<string>} string
   */
  public static randomString(size?: number, enc: 'hex' | 'base64' = 'base64'): string {
    return crypto.randomBytes(size || 64).toString(enc);
  }

  /**
   * data to be encrypted
   * @param {data.<stirng>} data
   * @returns {*.<string>} encrypted text
   */
  public encrypt(data: string | number | boolean | object): string {
    /**
     * this does the actual processing return a string
     * resulting from charCode conversion, salting and
     * hexadecimal mapping
     */
    try {
      const encodedMessage = JSON.stringify(data).split('')
        .map(this.convertTextToDecimal)
        .map(this.applySecretToCharacters)
        .map(this.convertByteToHexadecimal)
        .join('');

      return this.encode(encodedMessage);
    } catch (e) {
      throw new Error('invalid data was entered, enter data of type object, number, string or boolean to be encrypted.' + e);
    }
  }

  /**
   * text be decrypted
   * @param {text.<stirng>} text
   * @returns {*.<string>} decrypted data
   */
  public decrypt(text: string): string | number | boolean | object {
    const encodeData = this.decode(text);

    const data = (encodeData).match(/.{1,2}/g)
      .map((hex: string) => parseInt(hex, 16))
      .map(this.applySecretToCharacters)
      .map((charCode: number | number[]) => String.fromCharCode(charCode as number))
      .join('');

    return JSON.parse(data);
  }
}
