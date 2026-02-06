import * as chai from "chai";

import ncrypt from "../index";
const expect = chai.expect;

// ==========================================
// Data Encryption/Decryption Tests
// ==========================================
describe("Data Encryption/Decryption", () => {
  // initialize
  const object = {
    NcryptJs: "is great.",
    You: "should try it!",
  };

  const number: number = 19960404;
  const string: string = "ncrypt-js is great.";
  const boolean: boolean = false;
  const _null = null as any;

  const _secret = "shhh its a secret";
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

  describe("RandomString", () => {
    it("should generate a random string", () => {
      const size = 32,
        secret = ncrypt.randomString(size, "hex");

      expect(secret.length).equal(size * 2);
      expect(typeof ncrypt.randomString(size, "hex")).equal("string");
    });

    it("should should generate a hex string", () => {
      const str = ncrypt.randomString(32, "hex");
      expect(Buffer.from(str, "hex").toString("hex") === str).equal(true);
    });

    it("should should generate a base64 string", () => {
      const str = ncrypt.randomString(32, "base64");
      expect(Buffer.from(str, "base64").toString("base64") === str).equal(true);
    });

    it("should generate string using default size and encoding", () => {
      const str = ncrypt.randomString();
      expect(Buffer.from(str, "base64").toString("base64") === str).equal(true);
    });
  });

  describe("Encryption", () => {
    it("should be able to encrypt a string", () => {
      expect(string).to.be.a("string");
      expect(typeof encryptString).to.eql("string");
    });

    it("should be able to encrypt an object", () => {
      expect(object).to.be.a("object");
      expect(typeof encryptObject).to.eql("string");
    });

    it("should be able to encrypt a number", () => {
      expect(number).to.be.a("number");
      expect(typeof encryptNumber).to.eql("string");
    });

    it("should be able to encrypt a boolean", () => {
      expect(boolean).to.be.a("boolean");
      expect(typeof encryptBoolean).to.eql("string");
    });
  });

  describe("Decryption", () => {
    it("should be able to decrypt original string", () => {
      expect(decryptString).to.be.eql(string);
      expect(typeof decryptString).to.eql("string");
    });

    it("should be able to decrypt original object", () => {
      expect(decryptObject).to.be.eql(object);
      expect(typeof decryptObject).to.eql("object");
    });

    it("should be able to decrypt original number", () => {
      expect(decryptNumber).to.be.eql(number);
      expect(typeof decryptNumber).to.eql("number");
    });

    it("should be able to decrypt original boolean", () => {
      expect(decryptBoolean).to.be.eql(boolean);
      expect(typeof decryptBoolean).to.eql("boolean");
    });
  });

  describe("Error handling and validations", () => {
    it("should error when secret is not provided", () => {
      try {
        encrypt("nullSecret");
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /must be initialized with a secret key of type string/,
        );
      }
    });

    it("should error when non-string data is passed as decryption string", () => {
      try {
        const nonStringData = 12345;
        //@ts-ignore
        decrypt(nonStringData);
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /argument must be a string, or a string-like object/,
        );
      }
    });

    it("should error when a non string data type is to be decrypted", () => {
      try {
        const nonStringData: any = void 0;
        decrypt(nonStringData);
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /argument must be a string, or a string-like object/,
        );
      }
    });

    it("should error when a non string data type is to be decrypted", () => {
      try {
        decrypt(decryptNullData);
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /argument must be a string, or a string-like object/,
        );
      }
    });

    it("should throw an error when an undefined data is to be encrypted", () => {
      try {
        encrypt(undefined as any);
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /invalid data was entered, enter data of type object, number, string or boolean to be encrypted./,
        );
      }
    });

    it("should throw an error when an undefined data is to be encrypted", () => {
      try {
        encrypt(null as any);
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /no data was entered, enter data of type object, number, string or boolean to be encrypted./,
        );
      }
    });

    it("should throw an error when an null data is to be encrypted", () => {
      try {
        encrypt(encryptNullData);
      } catch (err) {
        expect((err as { message: string }).message).matches(
          /invalid data was entered, enter data of type object, number, string or boolean to be encrypted./,
        );
      }
    });
  });
});

// ==========================================
// Password Hashing Tests
// ==========================================
describe("Password Hashing/Verificatioin", () => {
  describe(".generate(password, [options])", function () {
    it("should throw an error if the password is not a valid string", function () {
      const invalid = [
        null,
        undefined,
        true,
        false,
        123,
        456.78,
        new Date(),
        {},
        [],
        function () {},
      ];
      invalid.forEach(function (value) {
        let err;
        try {
          ncrypt.generate(value as string);
        } catch (e) {
          err = e;
        }

        expect(err).to.be.instanceOf(Error);
        expect((err as { message: string }).message).to.equal(
          "Invalid message digest algorithm",
        );
      });
    });

    it("should throw an error if an invalid message digest algorithm is specified", function () {
      let err;
      try {
        ncrypt.generate("password123", { algorithm: "foo" });
      } catch (e) {
        err = e;
      }

      expect(err).to.be.instanceOf(Error);
      expect((err as any).message).to.equal("Invalid message digest algorithm");
    });

    it("should throw an error if the salt length is invalid", function () {
      const invalid = [-10, "abc", 5.5, [], {}];
      invalid.forEach(function (value) {
        let err;
        try {
          ncrypt.generate("password123", { saltLength: value as number });
        } catch (e) {
          err = e;
        }
        expect(err).to.be.instanceOf(Error);
        expect((err as any).message).to.equal("Invalid salt length");
      });
    });

    it("should generate unique hashed passwords", function () {
      const password = "password123",
        hash1 = ncrypt.generate(password),
        hash2 = ncrypt.generate(password);

      expect(hash1).to.not.equal(hash2);
      expect(ncrypt.verify(password, hash1)).to.be.true;
      expect(ncrypt.verify(password, hash2)).to.be.true;
    });

    it("should store the algorithm in the hashed password", function () {
      const password = "password123",
        hash = ncrypt.generate(password, { algorithm: "md5" }),
        parts = hash.split("$");

      expect(ncrypt.verify(password, hash)).to.be.true;
      expect(parts[0]).to.equal("md5");
    });

    it("should store the salt length in the hashed password", function () {
      const password = "password123",
        len = 20,
        hash = ncrypt.generate(password, {
          algorithm: "md5",
          saltLength: len,
        }),
        parts = hash.split("$");

      expect(ncrypt.verify(password, hash));
      expect(parts.length).to.equal(4);
      expect(parts[1].length).to.equal(len);
    });

    it("should apply the hashing algorith mutliple times if iterations are specified", function () {
      const password = "password123",
        hash = ncrypt.generate(password, {
          algorithm: "md5",
          iterations: 1000,
        }),
        parts = hash.split("$");

      expect(ncrypt.verify(password, hash));
      expect(parts[0]).to.equal("md5");
      expect(parts[2]).to.equal("1000");
    });

    it("supports base64 encoding", () => {
      const password = "password123";

      const hash = ncrypt.generate(password, {
        encoding: "base64",
      });

      expect(ncrypt.verify(password, hash, { encoding: "base64" })).to.be.true;
    });

    it("supports a custom separator", () => {
      const password = "password123";
      const separator = ".";

      const hash = ncrypt.generate(password, {
        separator,
      });

      expect(ncrypt.verify(password, hash, { separator })).to.be.true;
    });
  });

  describe(".verify(password, hashedPassword)", function () {
    it("should return true if the password matches the hash", function () {
      const password = "password123",
        hash = ncrypt.generate(password);

      expect(ncrypt.verify(password, hash));
    });

    it("should return false if the password does not match the hash", function () {
      const password = "password123",
        hash = ncrypt.generate(password),
        index = hash.indexOf("$");

      expect(ncrypt.verify(password, hash.substr(index + 1))).to.be.false;
      expect(ncrypt.verify(password, hash.substr(index))).to.be.false;
    });

    it("fails verification if hash format is invalid", () => {
      expect(ncrypt.verify("password", "invalid$hash")).to.be.false;
    });

    it("should return false if password is null", () => {
      const hash = ncrypt.generate("password123");
      expect(ncrypt.verify(null as any, hash)).to.be.false;
    });

    it("should return false if password is empty string", () => {
      const hash = ncrypt.generate("password123");
      expect(ncrypt.verify("", hash)).to.be.false;
    });

    it("should return false if hashedPassword is null", () => {
      expect(ncrypt.verify("password123", null as any)).to.be.false;
    });

    it("should return false if hashedPassword is empty string", () => {
      expect(ncrypt.verify("password123", "")).to.be.false;
    });

    it("should return false if both password and hashedPassword are null", () => {
      expect(ncrypt.verify(null as any, null as any)).to.be.false;
    });
  });

  describe(".isHashed(password)", function () {
    it("should return true if the string is a hashed password", function () {
      const hash = ncrypt.generate("password123");
      expect(ncrypt.isHashed(hash)).to.true;
    });

    it("should return false if the string is not a hashed password", function () {
      expect(ncrypt.isHashed("password123")).to.be.false;
    });

    it("should return false if password is null", () => {
      expect(ncrypt.isHashed(null as any)).to.be.false;
    });

    it("should return false if password is empty string", () => {
      expect(ncrypt.isHashed("")).to.be.false;
    });

    it("should return false if password is undefined", () => {
      expect(ncrypt.isHashed(undefined as any)).to.be.false;
    });
  });

  describe("Private methods (default parameters)", function () {
    describe(".generateSalt()", function () {
      it("should use default encoding 'hex' when not provided", function () {
        const salt = (ncrypt as any)["generateSalt"](8);
        expect(typeof salt).to.equal("string");
        expect(salt.length).to.equal(8);
        // Verify it's valid hex
        expect(/^[0-9a-f]+$/i.test(salt)).to.be.true;
      });

      it("should use provided encoding when specified", function () {
        const salt = (ncrypt as any)["generateSalt"](8, "base64");
        expect(typeof salt).to.equal("string");
        expect(salt.length).to.equal(8);
      });
    });

    describe(".generateHash()", function () {
      it("should use default iterations (1) when not provided", function () {
        const hash = (ncrypt as any)["generateHash"](
          "sha1",
          "testsalt",
          "password123",
        );
        expect(hash).to.include("sha1");
        expect(hash).to.include("testsalt");
        expect(hash).to.include("1");
        expect(hash.split("$").length).to.equal(4);
      });

      it("should use default encoding 'hex' when not provided", function () {
        const hash = (ncrypt as any)["generateHash"](
          "sha1",
          "testsalt",
          "password123",
          1,
        );
        expect(hash).to.include("sha1");
        expect(hash).to.include("testsalt");
        expect(hash.split("$").length).to.equal(4);
      });

      it("should use default separator '$' when not provided", function () {
        const hash = (ncrypt as any)["generateHash"](
          "sha1",
          "testsalt",
          "password123",
          1,
          "hex",
        );
        expect(hash.split("$").length).to.equal(4);
      });

      it("should use all default parameters when only required ones are provided", function () {
        const hash = (ncrypt as any)["generateHash"](
          "sha1",
          "testsalt",
          "password123",
        );
        const parts = hash.split("$");
        expect(parts.length).to.equal(4);
        expect(parts[0]).to.equal("sha1");
        expect(parts[1]).to.equal("testsalt");
        expect(parts[2]).to.equal("1"); // default iterations
      });
    });
  });
});
