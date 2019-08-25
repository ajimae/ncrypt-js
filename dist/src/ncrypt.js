"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ncrypt {
    constructor(text, salt) {
        /**
         * convert all entered text to decimal equivalent character codes
         * @param {data.<string>} data to be converted
         * @return {Array.<number>} array of character codes
         */
        this.convertTextToDecimal = (data) => data.split('').map((value) => value.charCodeAt(0));
        /**
         * encode provided salt on decimal character codes
         * @param {charCode<number[], *>} character codes
         */
        this.applySaltToCharacters = (charCodes) => this.convertTextToDecimal(this.salt)
            .reduce((firstValue, secondValue) => (firstValue ^ secondValue), charCodes);
        /**
         * convert character bytes to hexadecimal equivalent
         * @param {number.<number>}
         * @returns {string} hexadecimal string
         */
        this.convertByteToHexadecimal = (number) => {
            return ("0" + Number(number).toString(16)).substr(-2);
        };
        this.salt = salt;
        this.text = text;
    }
    /**
     * process data to be encrypted
     * @param {}
     * @returns {string.<string>} encoded string data
     */
    encodeData() {
        const data = this.text;
        if (data == void 0)
            throw new Error('no data was entered, enter data of type object, number, string or boolean to be encrypted.');
        /**
         * this does the actual processing return a string
         * resulting from charCode conversion, salting and
         * hexadecimal mapping
         */
        return data.split('')
            .map(this.convertTextToDecimal)
            .map(this.applySaltToCharacters)
            .map(this.convertByteToHexadecimal)
            .join('');
    }
    /**
     * decodes encoded string resulting from util encryption
     * @param {string.<stirng>} encodeData
     * @returns {decodedData.<string>} decoded data
     */
    decodeData(encodeData) {
        return encodeData.match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(this.applySaltToCharacters)
            .map((charCode) => String.fromCharCode(charCode))
            .join('');
    }
}
exports.default = Ncrypt;
