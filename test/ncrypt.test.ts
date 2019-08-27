import * as chai from "chai";

import * as ncrypt from '../index';

const expect = chai.expect;
const { encrypt, decrypt } = ncrypt;

const object = {
  NcryptJs: "is great.",
  You: "should try it!"
};
const string = "ncrypt-js is great.";
const number = 19960404;
const boolean = false;

const _secret = 'shhh its a secret';
const _nullSecret: any = null;

const encryptString = encrypt(string, _secret);
const encryptNumber = encrypt(number, _secret);
const encryptObject = encrypt(object, _secret);
const encryptBoolean = encrypt(boolean, _secret);

const decryptString = decrypt(encryptString);
const decryptNumber = decrypt(encryptNumber);
const decryptObject = decrypt(encryptObject);
const decryptBoolean = decrypt(encryptBoolean);

describe('Encrytion', () => {
  it('should be able to encrypt a string', () => {
    expect(string).to.be.a('string');
    expect(typeof encryptString).to.eql('string');
  });

  it('should be able to encrypt an object', () => {
    expect(object).to.be.a('object');
    expect(typeof encryptObject).to.eql('string');
  });

  it('should be able to encrypt a number', () => {
    expect(number).to.be.a('number');
    expect(typeof encryptNumber).to.eql('string');
  });

  it('should be able to encrypt a boolean', () => {
    expect(boolean).to.be.a('boolean');
    expect(typeof encryptBoolean).to.eql('string');
  });
});

describe('Decrytion', () => {
  it('should be able to decrypt original string', () => {
    expect(decryptString).to.be.eql(string);
    expect(typeof decryptString).to.eql('string');
  });

  it('should be able to decrypt original object', () => {
    expect(decryptObject).to.be.eql(object);
    expect(typeof decryptObject).to.eql('object');
  });

  it('should be able to decrypt original number', () => {
    expect(decryptNumber).to.be.eql(number);
    expect(typeof decryptNumber).to.eql('number');
  });

  it('should be able to decrypt original boolean', () => {
    expect(decryptBoolean).to.be.eql(boolean);
    expect(typeof decryptBoolean).to.eql('boolean');
  });
});

describe('Error handling and validations', () => {
  it('should error when secret is not provided', () => {
    try {
      encrypt('nullSecret', _nullSecret);
    } catch (error) {
      expect(error.message).equal('must be initialized with a secret key of type string');
    }
  });

  it('should error when non-string data is passed as decryption string', () => {
    try {
      const nonStringData = '["string"]';
      decrypt(nonStringData);
    } catch (error) {
      expect(error.message).equal('argument must be a string, or a string-like object');
    }
  });

  it('should error when a non string data type is to be decrypted', () => {
    try {
      const nonStringData: any = void(0);
      decrypt(nonStringData);
    } catch (error) {
      expect(error.message).equal('argument must be a string, or a string-like object');
    }
  });

  it('should throw an error when an undefined data is to be encrypted', () => {
    try {
      encrypt(undefined, _secret);
    } catch (error) {
      expect(error.message).equal('no data was entered, enter data of type object, number, string or boolean to be encrypted.');
    }
  });

  it('should throw an error when an undefined data is to be encrypted', () => {
    try {
      encrypt(null, _secret);
    } catch (error) {
      expect(error.message).equal('no data was entered, enter data of type object, number, string or boolean to be encrypted.');
    }
  });
});
