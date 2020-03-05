import { INcrypt } from './ncrypt.d';
import { encode, decode } from './utils';

export default class Ncrypt implements INcrypt {

  /**
   * ncrypt namespace.
   * @type {string.<*>}
   */
  private secret: string;

  /**
   * ncrypt namespace.
   * @type {string.<*>}
   */
  private text: string;
  /**
   * object constructor
   * @param text 
   * @param secret 
   */
  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * convert all entered text to decimal equivalent character codes
   * @param {data.<string>} data to be converted
   * @return {Array.<number>} array of character codes
   */
  convertTextToDecimal = (data: string) => data.split('').map((value) => value.charCodeAt(0));

  /**
   * encode provided secret on decimal character codes
   * @param {charCode<number[], *>} character codes
   */
  applySecretToCharacters = (charCodes: number[] | number | string) => this.convertTextToDecimal(this.secret)
    .reduce((firstValue: any, secondValue: any) => (firstValue ^ secondValue), charCodes)

  /**
   * convert character bytes to hexadecimal equivalent
   * @param {number.<number>}
   * @returns {string} hexadecimal string
   */
  convertByteToHexadecimal = (number: number) => {
    return ("0" + Number(number).toString(16)).substr(-2);
  }

  /**
   * process data to be encrypted
   * @param {}
   * @returns {string.<string>} encoded string data
   */
  encrypt = (data: object | string | number | boolean) => {
    /**
     * this does the actual processing return a string
     * resulting from charCode conversion, salting and 
     * hexadecimal mapping
     * 
     */
    // if (data == void 0) throw new Error('invalid data was entered, enter data of type object, number, string or boolean to be encrypted.');
    try {
      const encodedMessage = JSON.stringify(data).split('')
        .map(this.convertTextToDecimal)
        .map(this.applySecretToCharacters)
        .map(this.convertByteToHexadecimal)
        .join('');

      return encode(encodedMessage);
    } catch (error) {
      throw new Error('invalid data was entered, enter data of type object, number, string or boolean to be encrypted.');
    }
  }

  /**
   * decodes encoded string resulting from util encryption
   * @param {string.<stirng>} encodeData 
   * @returns {decodedData.<string>} decoded data
   */
  decrypt = (text: string) => {
    const encodeData = decode(text);

      const data = encodeData.match(/.{1,2}/g)
        .map((hex: any) => parseInt(hex, 16))
        .map(this.applySecretToCharacters)
        .map((charCode: any) => String.fromCharCode(charCode))
        .join('');

        const arr = [];
        arr.push(data);

      return JSON.parse(data);
  }
}
