# NcryptJs

[![Build Status](https://travis-ci.com/ajimae/ncrypt-js.svg?branch=master)](https://travis-ci.com/ajimae/ncrypt-js) [![Coverage Status](https://coveralls.io/repos/github/ajimae/ncrypt-js/badge.svg)](https://coveralls.io/github/ajimae/ncrypt-js) ![NPM](https://img.shields.io/npm/l/ncrypt-js)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/ajimae/ncrypt-js) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ajimae/ncrypt-js) ![GitHub issues](https://img.shields.io/github/issues/ajimae/ncrypt-js)

**_NcryptJs_** is a light weight javascript data encryption and decryption library. This library implements the nodejs default crypto functionality as a mid-channel cipher in addition to a simple and elegant custom data encoding and encryption algorithm.

<!-- ```diff
- const ReduxThunk = require('redux-thunk')
+ const ReduxThunk = require('redux-thunk').default
``` -->

## Contents

* [NcryptJs](#NcryptJs)
  * [Contents](#contents)
  <!-- * [Changes Log (What's New)](#changes-log-whats-new) -->
  * [Getting Started](#getting-started)
    * [Installation](#installation)
  * [Documentation](#documentation)
    * [NcryptJs Functions](#ncryptjs-functions)
    * [Using `encrypt()` and `decrypt()`](#using-encrypt-and-decrypt)
    * [Using default imports](#Using-default-imports)
    <!-- * [Change the Secret Key](#change-the-secret-key)
    * [Object Encryption](#object-encryption)
    * [Random Key Generator](#random-key-generator) -->
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

```diff
// ES6 and later
+ import ncrypt from "ncrypt-js";
- import * as ncrypt from "ncrypt-js";

// or
- import { encrypt, decrypt } from "ncrypt-js";
```

However, if you are using ECMAScript 5 and older, use the require statement:

```diff
// ES5 and older
+ var ncrypt = require("ncrypt-js");

// or
- var { encrypt, decrypt } = require("ncrypt-js");
```

## Documentation

**_NcryptJs_** is a simple library with only two two exposed functions. This is all intentional mainly to keep everything simple. This is a complete documentation of the library and how to use it in your project. All examples work on both ECMAScript 6 (and later) and ECMAScript 5 (and older).

### NcryptJs Functions


### List of **_NcryptJs_** functions.



| Functions                                                                                              | Description                                                                                            | Parameters                                                                                             | Return                                                                                                 |
| -------------------------------------------------------------                                          | --------------------------------------------------------------------------------------                 | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                                                             | ----------------------------------------------------------------------------------------------------------------                                                                                                |
| **encrypt()**                                                                                          | Encrypts data.                                                                                     |**data**: _object/string/number/boolean_ - The data to be encrypted. <br/>|**ciphered**: _string_ - encrypted data.                                                                    |
| **decrypt()**                                                                                          | Decrypts the encrypted or ciphered data                                                                 | **encodedData**: string - The encrypted data: _string_ to be decrypted.                        | **data**: _string/object/number/boolean_ - The decrypted or original data (it might be string or object, depends on the initial input data type).



### Using `encrypt()` and `decrypt()` functons - As of version 1.1.0 this is deprecated, an object must be created first.

To encrypt and decrypt data, simply use `encrypt()` and `decrypt()` functions respectively. This will use `AES-256-CBC` encryption algorithm as the mid-channel cipher.

```diff
- var { encrypt, decrypt } = require("ncrypt-js");
+ var ncrypt = require("ncrypt-js");


var data = "Hello World!";
var _secretKey = "some-super-secret-key";

+ var { encodeData, decodeData } = new ncrypt(_secretKey);

// encrypting super sensitive data here
- var encryptedData = encrypt(data, _secretKey);
+ var encryptedData = encrypt(data);

console.log("Encryption process...");
console.log("Plain Text    : " + data);
console.log("Cipher Text   : " + encryptedData);

// decrypted super encrypted string here
var decryptedData = decrypt(encryptedData);
console.log("... and then decryption...");
console.log("Decipher Text : " + decryptedData);
console.log("...done.");
```

### Using default imports

```javascript
var ncrypt = require("ncrypt-js");

var data = "Hello World!";
var _secretKey = "some-super-secret-key";

var ncryptObject = new ncrypt(_secretKey);

// encrypting super sensitive data here
var encryptedData = ncryptObject.encrypt(data);
console.log("Encryption process...");
console.log("Plain Text    : " + data);
console.log("Cipher Text   : " + encryptedData);

// decrypted super encrypted string here
var decryptedData = ncryptObject.decrypt(encryptedData);
console.log("... and then decryption...");
console.log("Decipher Text : " + decryptedData);
console.log("...done.");
```

### Object Encryption

Encryption and decryption of JavaScript object literal has never been simpler than this. 

To encrypt and decrypt JavaScript object literal, simply use `encrypt()` and `decrypt()` function from an instance. This will use AES-CBC encryption algorithm.


```javascript
var ncrypt = require("ncrypt-js");

var _secretKey = "some-super-secret-key";
var object = {
  NycryptJs: "is cool and fun.",
  You: "should try it!"
}

var ncryptObject = new ncrypt('ncrypt-js');

// encrypting super sensitive data here
var encryptedObject = ncryptObject.encrypt(object);
console.log("Encryption process...");
console.log("Plain Object     : " + object);
console.log("Encrypted Object : " + encryptedObject);

// decrypted super encrypted string here
var decryptedObject = ncryptObject.decrypt(encryptedObject);
console.log("... and then decryption...");
console.log("Decipher Text : " + decryptedObject);
console.log("...done.");
```

## Built With 

Written in [TypeScript](https://typscriptlang.org/), built into ECMAScript 5 using the TypeScript compiler.

## Contribution

To contribute, simply fork this project, and issue a pull request.

## Version Management

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
