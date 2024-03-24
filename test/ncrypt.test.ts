import * as chai from 'chai';

import ncrypt from '../index';
const expect = chai.expect;

// initialize
const object = {
  NcryptJs: "is great.",
  You: "should try it!"
};

const number: number = 19960404;
const string: string = "ncrypt-js is great.";
const boolean: boolean = false;
const _null = null as any;

const _secret = 'shhh its a secret';
const { encrypt, decrypt } = new ncrypt(_secret);

const encryptString = encrypt(string);
const encryptNumber = encrypt(number);
const encryptObject = encrypt(object);
const encryptBoolean = encrypt(boolean);
const encryptNullData = encrypt(_null);

const decryptString = decrypt(encryptString);
const decryptNumber = decrypt(encryptNumber);
const decryptObject = decrypt(encryptObject);
const decryptBoolean = decrypt(encryptBoolean);
const decryptNullData = encrypt(_null);

describe('RandomString', () => {
  it('should generate a random string', () => {
    const size = 32, secret = ncrypt.randomString(size, 'hex');

    expect(secret.length).equal((size * 2));
    expect(typeof ncrypt.randomString(size, 'hex')).equal('string');
  });

  it('should should generate a hex string', () => {
    const str = ncrypt.randomString(32, 'hex');
    expect(Buffer.from(str, 'hex').toString('hex') === str).equal(true);
  });

  it('should should generate a base64 string', () => {
    const str = ncrypt.randomString(32, 'base64');
    expect(Buffer.from(str, 'base64').toString('base64') === str).equal(true);
  });

  it('should generate string using default size and encoding', () => {
    const str = ncrypt.randomString();
    expect(Buffer.from(str, 'base64').toString('base64') === str).equal(true);
  });
});

describe('Encryption', () => {
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

describe('Decryption', () => {
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
      encrypt('nullSecret');
    } catch (error) {
      expect(error.message).matches(/must be initialized with a secret key of type string/);
    }
  });

  it('should error when non-string data is passed as decryption string', () => {
    try {
      const nonStringData = 12345;
      //@ts-ignore
      decrypt(nonStringData);
    } catch (error) {
      expect(error.message).matches(/argument must be a string, or a string-like object/);
    }
  });

  it('should error when a non string data type is to be decrypted', () => {
    try {
      const nonStringData: any = void (0);
      decrypt(nonStringData);
    } catch (error) {
      expect(error.message).matches(/argument must be a string, or a string-like object/);
    }
  });

  it('should error when a non string data type is to be decrypted', () => {
    try {
      decrypt(decryptNullData);
    } catch (error) {
      expect(error.message).match(/argument must be a string, or a string-like object/);
    }
  });

  it('should throw an error when an undefined data is to be encrypted', () => {
    try {
      encrypt(undefined as any);
    } catch (error) {
      expect(error.message).match(/invalid data was entered, enter data of type object, number, string or boolean to be encrypted./);
    }
  });

  it('should throw an error when an undefined data is to be encrypted', () => {
    try {
      encrypt(null as any);
    } catch (error) {
      expect(error.message).match(/no data was entered, enter data of type object, number, string or boolean to be encrypted./);
    }
  });

  it('should throw an error when an null data is to be encrypted', () => {
    try {
      encrypt(encryptNullData);
    } catch (error) {
      expect(error.message).match(/invalid data was entered, enter data of type object, number, string or boolean to be encrypted./);
    }
  });
});

