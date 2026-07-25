import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { ncrypt } from "../dist/ncrypt";

const OUT_DIR = process.cwd() + '/examples/out'
const ENCRYPTED_FILE = OUT_DIR + '/encrypted.txt'
const COMPARE_FILE = OUT_DIR + '/compare.txt'

const SECRET = process.env.ENCRYPTION_SECRET || "my-super-secret-key";
const ncryptObject = new ncrypt(SECRET);

(function () {
  const mode = process.argv[2];
  mkdirSync(OUT_DIR, { recursive: true });

  if (mode === "encrypt") {
    const data = process.argv[3] || "Hello World!";
    const encrypted = ncryptObject.encrypt(data);
    writeFileSync(ENCRYPTED_FILE, encrypted, "utf-8");
    console.log("Plain Text :", data);
    console.log("Cipher Text:", encrypted);
    process.exit(0);
  }

  if (mode === "decrypt") {
    if (!existsSync(ENCRYPTED_FILE)) {
      console.error("No encrypted file found. Run with --encrypt first.");
      process.exit(1);
    }
    const encrypted = readFileSync(ENCRYPTED_FILE, "utf-8").trim();
    const decrypted = ncryptObject.decrypt(encrypted);
    console.log("Cipher Text:", encrypted);
    console.log("Decrypted  :", decrypted);
    process.exit(0);
  }

  if (mode === "compare") {
    const a = process.argv[3] || "hello";
    const b = process.argv[4] || "hello";
    const encA = ncryptObject.encrypt(a);
    const encB = ncryptObject.encrypt(b);
    const result = ncryptObject.compare(encA, encB);
    console.log(`"${a}" == "${b}" ?`, result);
    process.exit(0);
  }

  // default: full round-trip
  const data = { msg: "hello world", ts: Date.now() };
  const encrypted = ncryptObject.encrypt(data);
  writeFileSync(ENCRYPTED_FILE, encrypted, "utf-8");
  console.log("Plain Object     :", data);
  console.log("Encrypted Object :", encrypted);

  const readback = readFileSync(ENCRYPTED_FILE, "utf-8").trim();
  const decrypted = ncryptObject.decrypt(readback);
  console.log("Decrypted Object :", decrypted);

  // compare
  const a = "same value";
  const b = "same value";
  const c = "different";
  console.log("Compare:");
  console.log(`  "${a}" == "${b}" ?`, ncryptObject.compare(ncryptObject.encrypt(a), ncryptObject.encrypt(b)));
  console.log(`  "${a}" == "${c}" ?`, ncryptObject.compare(ncryptObject.encrypt(a), ncryptObject.encrypt(c)));
})()
