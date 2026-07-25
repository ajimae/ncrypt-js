import * as crypto from "node:crypto";

export type TNCRYPT_ENC = "base64" | "binary" | "hex" | "ucs-2" | "ucs2" | "utf16le";
export type THASH_ENC = {
  algorithm?: string;
  saltLength?: number;
  iterations?: number;
  encoding?: "base64" | "hex";
  separator?: string;
};

/**
 * keyset
 */
export interface Keyset {
  id: string;
  skey: Buffer;
  ekey: Buffer;
}

export interface Keysets {
  [id: string]: Keyset;
}

export interface Payload {
  [key: string]: unknown;
}

export interface DecodedResult {
  id: string;
  payload: Payload;
}

export interface EncodeHeader {
  kid: string;
}

/**
 * @class Ncrypt
 * @type {Ncrypt.<object>}
 */
export { Ncrypt as ncrypt }
export default class Ncrypt {
  /**
   * encryption secret.
   * @type {secret.<string>} secret
   */
  private secret: string;

  /**
   * algorithm used for encoding message
   */
  private readonly algorithm = "aes-256-cbc";

  /**
   * ecoding for encrypted stirng
   */
  private readonly enc = (process.env.NCRYPT_ENC as TNCRYPT_ENC) || "hex";

  /**
   * crypto random initial vector generated from core node {crypto} module
   */
  private readonly initialVector: Buffer = crypto.randomBytes(16);

  /**
   * hashing salt
   */
  // private readonly saltChars =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  /**
   * crypto random key generated from core node {crypto} module
   * {note}: please read the value for KEY from your app's environment
   */
  private readonly key: Buffer = crypto.scryptSync(
    process.env.KEY || "please provide a KEY in your .env file or config",
    "salt",
    32,
  );

  /**
   * object constructor
   * @param {secret.<string>} secret
   */
  constructor(secret: string) {
    this.secret = secret;

    // bind public instance methods
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.compare = this.compare.bind(this);
  }

  /**
   * convert all entered text to decimal equivalent character codes
   * @param {text.<string>} text to be converted
   * @return {Array.<number>} array of character codes
   */
  private convertTextToDecimal = (text: string): number[] => {
    return text.split("").map((value) => value.charCodeAt(0));
  };

  /**
   * encode provided secret on decimal character codes
   * @param {charCode.<number, number[]>} charCodes
   * @returns {*.<number>} decimal string
   */
  private applySecretToCharacters = (charCodes: number | number[]): number => {
    return this.convertTextToDecimal(this.secret).reduce(
      (firstValue: number, secondValue: number) => firstValue ^ secondValue,
      charCodes as number,
    );
  };

  /**
   * convert character bytes to hexadecimal equivalent
   * @param {number.<number>} number
   * @returns {*.<string>} hexadecimal string
   */
  private convertByteToHexadecimal = (number: number): string => {
    return ("0" + Number(number).toString(16)).substr(-2);
  };


  /**
   * encodes a payload into a JOSE-like dot-separated token
   * uses AES-256-CBC encryption with a random IV and HMAC-SHA256 signing
   *
   * @param {Payload} payload - the data to encode
   * @param {Keyset} keyset - the keyset containing id, signing key (skey), and encryption key (ekey)
   * @returns {string} dot-separated token in the format: base64url(header).base64url(ciphertext).base64url(iv).base64url(signature)
   */
  static encode(payload: Payload, keyset: Keyset): string {
    const header: EncodeHeader = { kid: keyset.id };
    const headerBuf = Buffer.from(JSON.stringify(header));
    const plaintextBuf = Buffer.from(JSON.stringify(payload));
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", keyset.ekey, iv);
    const encrypted = Buffer.concat([cipher.update(plaintextBuf), cipher.final()]);
    const sig = crypto.createHmac("sha256", keyset.skey).update(encrypted).update(iv).digest();

    const parts = [headerBuf, encrypted, iv, sig].map((b) => b.toString("base64url"));
    return parts.join(".");
  }

  /**
   * decodes and verifies a JOSE-like token produced by encode()
   * validates the HMAC-SHA256 signature via timing-safe comparison,
   * then decrypts the ciphertext with AES-256-CBC
   *
   * @param {string} payload - the dot-separated token to decode
   * @param {Keysets} keysets - object mapping key IDs to Keysets, used to look up the keyset matching the token's kid header
   * @returns {DecodedResult} object containing the key id and decrypted payload
   * @throws {Error} "Malformed payload." if the token format is invalid
   * @throws {Error} "Payload protected with unsupported keyset." if the key id is not found in keysets
   * @throws {Error} "Signatures do not match." if HMAC verification fails
   * @throws {Error} "Payload decryption failed." if decryption or JSON parsing fails
   */
  static decode(payload: string, keysets: Keysets): DecodedResult {
    const tokens = payload.split(".");
    if (tokens.length !== 4) throw new Error("Malformed payload.");

    const [headerB64, encryptedB64, ivB64, sigB64] = tokens;

    let header: EncodeHeader;
    let encrypted: Buffer;
    let iv: Buffer;
    let sig: Buffer;
    try {
      header = JSON.parse(
        Buffer.from(headerB64, "base64url").toString("utf-8"),
      );
      encrypted = Buffer.from(encryptedB64, "base64url");
      iv = Buffer.from(ivB64, "base64url");
      sig = Buffer.from(sigB64, "base64url");
    } catch {
      throw new Error("Malformed payload.");
    }

    if (!header?.kid) throw new Error("Malformed payload.");

    const keyset = keysets[header.kid];
    if (!keyset) throw new Error("Payload protected with unsupported keyset.");

    const actualSig = crypto.createHmac("sha256", keyset.skey)
      .update(encrypted)
      .update(iv)
      .digest();

    if (!crypto.timingSafeEqual(actualSig, sig)) {
      throw new Error("Signatures do not match.");
    }

    const decipher = crypto.createDecipheriv("aes-256-cbc", keyset.ekey, iv);
    let plaintext: Payload;
    try {
      plaintext = JSON.parse(
        Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
          "utf-8",
        ),
      );
    } catch {
      throw new Error("Payload decryption failed.");
    }

    return { id: header.kid, payload: plaintext };
  }


  /**
   * intermediate data encoder function
   * @param {string.<any>} text
   * @param secret
   * @returns {string} encrypted or cipher text
   */
  private encode = (text: string): string => {
    let cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      this.initialVector,
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${this.initialVector.toString(this.enc)}.${encrypted.toString(this.enc)}`;
  };

  /**
   * intermediate data decoder function
   * @param {string.<any>} text
   * @returns {string.<string>} decrypted data
   */
  private decode = (text: string): string => {
    if (typeof text !== "string") {
      throw new TypeError("argument must be a string, or a string-like object");
    }

    const iv = text.split(".")[0];
    const encryptedData = text.split(".")[1];

    let _iv = Buffer.from(iv, this.enc);
    let encryptedText = Buffer.from(encryptedData, this.enc);
    let decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      _iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  };

  /**
   *
   * generate salt method
   * @param length
   * @param enc
   * @returns
   */
  private static generateSalt(length: number, enc: "hex" | "base64" = "hex") {
    if (
      typeof length != "number" ||
      length <= 0 ||
      length !== parseInt(length as any, 10)
    ) {
      throw new Error("Invalid salt length");
    }

    // ensure your JS environment supports the `crypto.randomBytes()` function
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString(enc)
      .substring(0, length);
  }

  /**
   *
   * generate hash method
   * @param algorithm
   * @param salt
   * @param password
   * @param iterations
   * @param enc
   * @param separator
   * @returns
   */
  private static generateHash(
    algorithm: string,
    salt: string,
    password: string,
    iterations: number = 1,
    enc: "hex" | "base64" = "hex",
    separator: string = "$",
  ) {
    try {
      let hash = password;
      for (let i = 0; i < iterations; ++i) {
        hash = crypto.createHmac(algorithm, salt).update(hash).digest(enc);
      }

      return (
        algorithm + separator + salt + separator + iterations + separator + hash
      );
    } catch (e) {
      throw new Error("Invalid message digest algorithm");
    }
  }

  /**
   *
   * generate hashed password method
   * @param password
   * @param options
   * @returns
   */
  public static generate(password: string, options: THASH_ENC = {}) {
    options.algorithm = options.algorithm || "sha1";
    options.saltLength = options.saltLength || 8;
    options.iterations = options.iterations || 1;
    options.encoding = options.encoding || "hex";
    options.separator = options.separator || "$";

    let salt = this.generateSalt(options.saltLength, options.encoding);
    return this.generateHash(
      options.algorithm,
      salt,
      password,
      options.iterations,
      options.encoding,
      options.separator,
    );
  }

  /**
   *
   * verify password method
   */
  public static verify(
    password: string,
    hashedPassword: string,
    options: THASH_ENC = {},
  ): boolean {
    if (!password || !hashedPassword) return false;

    options.encoding = options.encoding || "hex";
    options.separator = options.separator || "$";

    let parts = hashedPassword.split(options.separator);
    if (parts.length != 4) return false;

    try {
      return (
        this.generateHash(
          parts[0],
          parts[1],
          password,
          parts[2] as any,
          options.encoding,
          options.separator,
        ) == hashedPassword
      );
    } catch (e) { }
    return false;
  }

  /**
   *
   * isHashed method
   * @param password
   * @param options
   * @returns
   */
  public static isHashed(password: string, options: THASH_ENC = {}) {
    if (!password) return false;
    options.separator = options.separator || "$";
    return password.split(options.separator).length == 4;
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
  public static randomString(
    size?: number,
    enc: "hex" | "base64" = "base64",
  ): string {
    return crypto.randomBytes(size || 64).toString(enc);
  }

  /**
   * compares two encrypted strings to determine if they decrypt to the same value
   *
   * @param {string} text1 - first encrypted string
   * @param {string} text2 - second encrypted string
   * @returns {boolean} true if both decrypt to the same plaintext, false if they differ or if either cannot be decrypted
   */
  public compare(text1: string, text2: string): boolean {
    try {
      return (this.decode(text1) == this.decode(text2))
    } catch (e) {
      return false
    }
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
      const encodedMessage = JSON.stringify(data)
        .split("")
        .map(this.convertTextToDecimal)
        .map(this.applySecretToCharacters)
        .map(this.convertByteToHexadecimal)
        .join("");

      return this.encode(encodedMessage);
    } catch (e) {
      throw new Error(
        "invalid data was entered, enter data of type object, number, string or boolean to be encrypted." +
        e,
      );
    }
  }

  /**
   * text be decrypted
   * @param {text.<stirng>} text
   * @returns {*.<string>} decrypted data
   */
  public decrypt(text: string): string | number | boolean | object {
    const encodeData = this.decode(text);

    const data = encodeData
      .match(/.{1,2}/g)!
      .map((hex: string) => parseInt(hex, 16))
      .map(this.applySecretToCharacters)
      .map((charCode: number | number[]) =>
        String.fromCharCode(charCode as number),
      )
      .join("");

    return JSON.parse(data);
  }
}
