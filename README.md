# NcryptJs

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ajimae/ncrypt-js/release.yml) [![Coverage Status](https://coveralls.io/repos/github/ajimae/ncrypt-js/badge.svg)](https://coveralls.io/github/ajimae/ncrypt-js) ![NPM Downloads](https://img.shields.io/npm/dw/ncrypt-js)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/ajimae/ncrypt-js)](https://github.com/ajimae/ncrypt-js/releases) [![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ajimae/ncrypt-js)](https://github/languages/code-size/ajimae/ncrypt-js) [![GitHub issues](https://img.shields.io/github/issues/ajimae/ncrypt-js)](https://github.com/ajimae/ncrypt-js/issues) [![NPM](https://img.shields.io/npm/l/ncrypt-js)](https://www.npmjs.com/package/ncrypt-js/v/2.0.0#license)

**_NcryptJs_** is a light weight javascript data encryption and decryption library. This library implements the nodejs default crypto functionality as a mid-channel cipher in addition to a simple and elegant custom data encoding and encryption algorithm.

## Contents

* [NcryptJs](#NcryptJs)
  * [Contents](#contents)
  * [Getting Started](#getting-started)
    * [Installation](#installation)
  * [Documentation](#documentation)
    * [NcryptJs Methods](#ncryptjs-methods)
    * [Using the `randomString()` methods](#using-randomstring-method)
    * [Using `encrypt()` and `decrypt()` methods](#using-encrypt-and-decrypt-methods)
    * [String Encryption](#string-encryption)
    * [Object Encryption](#object-encryption)
    * [Using password hashing methods](#using-password-hashing-methods)
  * [Built With](#built-with)
  * [Contribution](#contribution)
  * [Version Management](#version-management)
  * [Authors](#authors)
  * [License](#license)
  * [Acknowledgments](#acknowledgments)

<!-- ## Changes Log (What's New)

**What's New in 2.2.0**

* Fix CDN release, setting webpack output as UMD with default library name of SimpleCrypto.
* CDN now have two file you may use, the distribution file and minified distribution one.

For full changelog, please refers to [CHANGELOG](CHANGELOG.md) file. -->

## Getting Started

This library is available through these javascript node package manager [npm](https://www.npmjs.org/) and [yarn](https://www.yarnpkg.com/).

## Installation

To use this library, first ensure you have a package manager initialized either with [npm](https://www.npmjs.org/) or [yarn](https://www.yarnpkg.com/)

```bash
# for npm use:
npm install --save ncrypt-js

# for yarn use:
yarn add ncrypt-js
```

To include **_ncrypt-js_** in your project. use one of these:

```js
// ES6 and later
import ncrypt from "ncrypt-js";
// or import { ncrypt } from "ncrypt-js"
```

However, if you are using ECMAScript 5 and older, use the require statement:

```js
// ES5 and older
var { ncrypt } = require("ncrypt-js");
```

## Documentation

**_NcryptJs_** is a simple library with only two two exposed functions. This is all intentional mainly to keep everything simple. This is a complete documentation of the library and how to use it in your project. All examples work on both ECMAScript 6 (and later) and ECMAScript 5 (and older).

### NcryptJs Methods


### List of **_NcryptJs_** Methods.



| Methods                                                                                              | Description                                                                                            | Parameters                                                                                             | Return                                                                                                 |
| -------------------------------------------------------------                                          | --------------------------------------------------------------------------------------                 | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                                                             | ----------------------------------------------------------------------------------------------------------------                                                                                                |
| [_static_] **randomString()**                                                                                          | Random String.                                                                                     |**size**: _number_ - An optional size of the generated `randomBytes`. <br/>**enc:** _base64/hex_ - Encoding used for encoding the `randomBytes` defaults to _`base64`_ |**encoded**: _string_ - encoded string.                                                                    |
| [_static_] **generate()**                                                                                          | Generates a hashed password.                                                                                     |**password**: _string_ - The password to hash. <br/>**options**: _object_ - Optional configuration object (see below). |**hashedPassword**: _string_ - The hashed password string.                                                                    |
| [_static_] **verify()**                                                                                          | Verifies a password against a hashed password.                                                                 | **password**: _string_ - The password to verify. <br/>**hashedPassword**: _string_ - The hashed password to verify against. <br/>**options**: _object_ - Optional configuration object (see below).                        | **boolean** - Returns `true` if the password matches the hash, `false` otherwise.
| [_static_] **isHashed()**                                                                                          | Checks if a string is a hashed password.                                                                 | **password**: _string_ - The string to check. <br/>**options**: _object_ - Optional configuration object (see below).                        | **boolean** - Returns `true` if the string appears to be a hashed password, `false` otherwise.
| **encrypt()**                                                                                          | Encrypts data.                                                                                     |**data**: _object/string/number/boolean_ - The data to be encrypted. <br/>|**ciphered**: _string_ - encrypted data.                                                                    |
| **decrypt()**                                                                                          | Decrypts the encrypted or ciphered data                                                                 | **encodedData**: string - The encrypted data: _string_ to be decrypted.                        | **data**: _string/object/number/boolean_ - The decrypted or original data (it might be string or object, depends on the initial input data type).


### Using randomString method

The `randomString()` static method can generate [random bytes](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback) encoded into a `hexadecimal` or `base64` strings. This string can be useful in a variety of use cases e.g to generate database ids, to generate a unique string for a list, a unique serial strings, api keys etc.

```ts
var { ncrypt } = require('ncrypt-js'); // or import ncrypt from 'ncrypt-js'

var randomStr = ncrypt.randomString(8, 'base64');
console.log(randomStr) // t78WcmYAFOY=

// signature
ncrypt.randomString(size?: number, enc?: 'base64' | 'hex');
```

### Using encrypt() and decrypt() methods
The `encrypt()` and `decrypt()` methods as of version 2.0.0 directly importing or invoking these methods is `deprecated`, an object must first be created with a secret, before the methods can then be invoked on the created object.

To `encrypt` and `decrypt` data, simply use `encrypt()` and `decrypt()` methods respectively. This will use `AES-256-CBC` encryption algorithm as the mid-channel cipher.

```diff
- var { encrypt, decrypt } = require("ncrypt-js");
+ var { ncrypt } = require("ncrypt-js");


var data = "Hello World!";
var _secretKey = "some-super-secret-key";

+ var { encrypt, decrypt } = new ncrypt(_secretKey);

// encrypting super sensitive data here
- var encryptedData = encrypt(data, _secretKey);
+ var encryptedData = encrypt(data);

console.log("Encryption process...");
console.log("Plain Text    : " + data);
console.log("Cipher Text   : " + encryptedData);

// decrypting the encrypted super sensitive data here
var decryptedData = decrypt(encryptedData);
console.log("... and then decryption...");
console.log("Decipher Text : " + decryptedData);
console.log("...done.");
```

### String Encryption

```javascript
var { ncrypt } = require("ncrypt-js");

var data = "Hello World!";
var _secretKey = "some-super-secret-key";

var ncryptObject = new ncrypt(_secretKey);

// encrypting super sensitive data here
var encryptedData = ncryptObject.encrypt(data);
console.log("Encryption process...");
console.log("Plain Text    : " + data);
console.log("Cipher Text   : " + encryptedData);

// decrypted super encrypted data here
var decryptedData = ncryptObject.decrypt(encryptedData);
console.log("... and then decryption...");
console.log("Decipher Text : " + decryptedData);
console.log("...done.");
```

### Object Encryption

Encryption and decryption of JavaScript object literal has never been simpler than this. 

To encrypt and decrypt JavaScript object literal, simply use `encrypt()` and `decrypt()` function from an instance. This will use AES-CBC encryption algorithm.


```javascript
var { ncrypt } = require("ncrypt-js");

var _secretKey = "some-super-secret-key";
var object = {
  NycryptJs: "is cool and fun.",
  You: "should try it!"
}

var ncryptObject = new ncrypt('ncrypt-js');

// encrypting super sensitive data here
var encryptedObject = ncryptObject.encrypt(object);
console.log("Encryption process...");
console.log("Plain Object     : ", object);
console.log("Encrypted Object : " + encryptedObject);

// decrypted super sensitive data here
var decryptedObject = ncryptObject.decrypt(encryptedObject);
console.log("... and then decryption...");
console.log("Decipher Text : ", decryptedObject);
console.log("...done.");
````
If you are using any sort of environmental key-value store, e.g `.env` and for additional security, you can add the following to your environment.

```bash
# .env

# used internally to set the `key`
KEY='sshhhh this is a super secret key'

# used internally to set the `encoding` - ['base64' | 'binary' | 'hex' | 'ucs-2' | 'ucs2' | 'utf16le']
NCRYPT_ENC='hex'

SECRET='this is our hashing secret'
```
When creating your object, you can use the `SECRET` from your environment e.g:

```js
var { ncrypt } = require('ncrypt-js');
var { encrypt, decrypt } = new ncrypt(process.env.SECRET);
...
```
_**NOTE:** The secret is required to decrypt the encrypted data, if the secret used to encrypt a specific data is lost, then that data cannot be decrypted._

_Same goes for encoding, if data was encrypted using `hex` encoding format, decrypting with a `base64` encoding or other encoding format and vise versa will not work_

### Using password hashing methods

The `generate()`, `verify()`, and `isHashed()` static methods provide secure password hashing and verification functionality. These methods use HMAC (Hash-based Message Authentication Code) for password hashing.

#### Generating a hashed password

The `generate()` method creates a secure hash of a password with a randomly generated salt.

```ts
var { ncrypt } = require('ncrypt-js'); // or import ncrypt from 'ncrypt-js'

var password = "mySecurePassword123";
var hashedPassword = ncrypt.generate(password);
console.log(hashedPassword); // sha1$abc12345$1$hashedvalue...

// signature
ncrypt.generate(password: string, options?: {
  algorithm?: string;          // Hash algorithm (default: 'sha1')
  saltLength?: number;         // Salt length in characters (default: 8)
  iterations?: number;         // Number of hash iterations (default: 1)
  encoding?: 'hex' | 'base64'; // Encoding format (default: 'hex')
  separator?: string;          // Separator character (default: '$')
});
```

#### Verifying a password

The `verify()` method checks if a plain text password matches a previously hashed password.

```ts
var { ncrypt } = require('ncrypt-js');

var password = "mySecurePassword123";
var hashedPassword = ncrypt.generate(password);

// Later, verify the password
var isValid = ncrypt.verify(password, hashedPassword);
console.log(isValid);           // true

// signature
ncrypt.verify(password: string, hashedPassword: string, options?: {
  encoding?: 'hex' | 'base64';  // Encoding format (default: 'hex')
  separator?: string;           // Separator character (default: '$')
});
```

#### Checking if a string is hashed

The `isHashed()` method checks if a string appears to be a hashed password by verifying its format.

```ts
var { ncrypt } = require('ncrypt-js');

var hashedPassword = ncrypt.generate("password123");
var isHashed = ncrypt.isHashed(hashedPassword);
console.log(isHashed); // true

var plainPassword = "password123";
var isHashed = ncrypt.isHashed(plainPassword);
console.log(isHashed); // false

// signature
ncrypt.isHashed(password: string, options?: {
  separator?: string; // Separator character (default: '$')
});
```

#### Advanced usage with custom options

You can customize the hashing algorithm, salt length, iterations, encoding, and separator:

```ts
var { ncrypt } = require('ncrypt-js');

// Generate with custom options
var hashedPassword = ncrypt.generate("password123", {
  algorithm: "sha256",   // Use SHA-256 instead of SHA-1
  saltLength: 16,        // Use 16 character salt
  iterations: 1000,      // Apply hashing 1000 times
  encoding: "base64",    // Use base64 encoding
  separator: "."         // Use '.' as separator instead of '$'
});

// Verify with matching options
var isValid = ncrypt.verify("password123", hashedPassword, {
  encoding: "base64",
  separator: "."
});
console.log(isValid); // true
```

**Available hash algorithms:** Any algorithm supported by Node.js `crypto.createHmac()`, such as `'sha1'`, `'sha256'`, `'sha512'`, `'md5'`, etc.

**Note:** The `encoding` and `separator` options must match between `generate()` and `verify()` calls for verification to succeed. To be safe, ensure you create a single options object and use the same object everywhere.

```ts
const same_options_obj = {
  ...
}

ncrypt.generate("pass", same_options_obj)
ncrypt.verify("pass", hasedPass, same_options_obj)
```

## Built With 

Written in [TypeScript](https://typscriptlang.org/), built into ECMAScript 5 using the TypeScript compiler.

## Contribution

To contribute, simply fork this project, and issue a pull request.

## Versioning

We use [SemVer](http://semver.org/) for version management. For the versions available, see the [tags on this repository](https://github.com/ajimae/ncrypt-js/tags).

## Authors

* **Chukwuemeka Ajima** - _Initial work_ - [ajimae](https://github.com/ajimae)

<!-- Feel free to include a CONTRIBUTORS.md file and modify this contributors secion -->
<!-- See also the list of [contributors](CONTRIBUTORS) who participated in this project. -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* This library was developed to simplify how data is encrypted and decrypted in javascript.
* Made available by open source and special thanks to [Shahid](https://twitter.com/codeforgeek) for his super simple [article](https://codeforgeek.com/encrypt-and-decrypt-data-in-node-js/) on node core encryption (crypto) library.
* Thanks to [danang-id](https://github.com/danang-id) whose [README](https://github.com/danang-id/simple-crypto-js/blob/master/README.md) was very insightful and [Jorgeblom](https://stackoverflow.com/users/2861702/jorgeblom) for his custom cipher algorithm on this stackoverflow [answer](https://stackoverflow.com/a/54026460/4907157)
