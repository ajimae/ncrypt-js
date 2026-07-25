import * as chai from "chai";
// import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { randomBytes } from "node:crypto"

import ncrypt from "../index";
const expect = chai.expect;

const defaultKeysets = {
  "1": {
    id: "1",
    skey: Buffer.from("signaturekey"),
    ekey: randomBytes(32),
  },
  "2": {
    id: "2",
    skey: Buffer.from("other-signature-key"),
    ekey: randomBytes(32),
  },
};


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

  describe('Payload Encyption and Decryption', () => {
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
})

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
        function () { },
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

// ==========================================
// Password Hashing Tests
// ==========================================
describe('json-sec', () => {
  describe("encode / decode roundtrip", () => {
    it("encodes and decodes a basic payload", () => {
      const payload = { name: "test", value: 42 };
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const result = ncrypt.decode(token, defaultKeysets);
      assert.deepEqual(result, { id: "1", payload });
    });

    it("encodes and decodes a deeply nested payload", () => {
      const payload = {
        level1: { level2: { level3: { value: "deep" } } },
      };
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const result = ncrypt.decode(token, defaultKeysets);
      assert.deepEqual(result, { id: "1", payload });
    });

    it("encodes and decodes an empty object", () => {
      const payload = {};
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const result = ncrypt.decode(token, defaultKeysets);
      assert.deepEqual(result, { id: "1", payload });
    });

    it("encodes and decodes payload with unicode", () => {
      const payload = { text: "héllo 世界 🔐" };
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const result = ncrypt.decode(token, defaultKeysets);
      assert.deepEqual(result, { id: "1", payload });
    });

    it("encodes and decodes payload with arrays and nulls", () => {
      const payload = { list: [1, "two", null, false] };
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const result = ncrypt.decode(token, defaultKeysets);
      assert.deepEqual(result, { id: "1", payload });
    });

    it("encodes with one keyset and decodes with the same keyset", () => {
      const payload = { msg: "hello" };
      const token = ncrypt.encode(payload, defaultKeysets["2"]);
      const result = ncrypt.decode(token, defaultKeysets);
      assert.equal(result.id, "2");
      assert.deepEqual(result.payload, payload);
    });

    it("produces different tokens for the same payload (random IV)", () => {
      const payload = { x: 1 };
      const token1 = ncrypt.encode(payload, defaultKeysets["1"]);
      const token2 = ncrypt.encode(payload, defaultKeysets["1"]);
      assert.notEqual(token1, token2);
      assert.deepEqual(ncrypt.decode(token1, defaultKeysets), ncrypt.decode(token2, defaultKeysets));
    });
  });

  describe("decode error handling", () => {
    it("throws on malformed payload (fewer than 4 parts)", () => {
      assert.throws(() => ncrypt.decode("a.b.c", defaultKeysets), /Malformed payload\./);
    });

    it("throws on malformed payload (more than 4 parts)", () => {
      assert.throws(() => ncrypt.decode("a.b.c.d.e", defaultKeysets), /Malformed payload\./);
    });

    it("throws on malformed payload (invalid base64url)", () => {
      assert.throws(() => ncrypt.decode("!!!.!!.!.!", defaultKeysets), /Malformed payload\./);
    });

    it("throws on malformed payload (invalid JSON header)", () => {
      const bad = "not-json".split(".").map((s) => Buffer.from(s).toString("base64url")).join(".");
      assert.throws(() => ncrypt.decode(bad + ".d.e.f", defaultKeysets), /Malformed payload\./);
    });

    it("throws on payload with missing kid in header", () => {
      const badHeader = Buffer.from(JSON.stringify({})).toString("base64url");
      const rest = [Buffer.from("a"), randomBytes(16), randomBytes(32)].map((b) => b.toString("base64url"));
      const token = [badHeader, ...rest].join(".");
      assert.throws(() => ncrypt.decode(token, defaultKeysets), /Malformed payload\./);
    });

    it("throws for unsupported keyset id", () => {
      const payload = { foo: "bar" };
      const token = ncrypt.encode(payload, { id: "unknown", skey: Buffer.from("k"), ekey: randomBytes(32) });
      assert.throws(() => ncrypt.decode(token, defaultKeysets), /unsupported keyset/);
    });

    it("throws when signature does not match (tampered ciphertext)", () => {
      const payload = { secret: 123 };
      const keyset = defaultKeysets["1"];
      const token = ncrypt.encode(payload, keyset);
      const parts = token.split(".");
      const tamperedCipher = Buffer.from("tampered").toString("base64url");
      const tamperedToken = [parts[0], tamperedCipher, parts[2], parts[3]].join(".");
      assert.throws(() => ncrypt.decode(tamperedToken, defaultKeysets), /Signatures do not match\./);
    });

    it("throws when signature does not match (tampered IV)", () => {
      const payload = { secret: 123 };
      const keyset = defaultKeysets["1"];
      const token = ncrypt.encode(payload, keyset);
      const parts = token.split(".");
      const tamperedIv = Buffer.from("tamperediv").toString("base64url");
      const tamperedToken = [parts[0], parts[1], tamperedIv, parts[3]].join(".");
      assert.throws(() => ncrypt.decode(tamperedToken, defaultKeysets), /Signatures do not match\./);
    });

    it("throws when decoded with a keyset with a different signing key", () => {
      const payload = { x: 1 };
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const wrongKeysets = {
        "1": { id: "1", skey: Buffer.from("wrong-signing-key"), ekey: defaultKeysets["1"].ekey },
      };
      assert.throws(() => ncrypt.decode(token, wrongKeysets), /Signatures do not match\./);
    });

    it("throws on decryption failure (wrong encryption key)", () => {
      const payload = { x: 1 };
      const token = ncrypt.encode(payload, defaultKeysets["1"]);
      const wrongKeysets = {
        "1": { id: "1", skey: defaultKeysets["1"].skey, ekey: randomBytes(32) },
      };
      assert.throws(() => ncrypt.decode(token, wrongKeysets), /Payload decryption failed\./);
    });
  });
})