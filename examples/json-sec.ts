import { randomBytes, createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { ncrypt } from "../dist/ncrypt";
import type { Keysets } from "../dist/ncrypt";

const OUT_DIR = process.cwd() + '/examples/out'
const TOKEN_FILE = OUT_DIR + '/token.txt'

const MASTER_SECRET = process.env.JSON_SEC_SECRET || randomBytes(32).toString("hex");

function deriveKey(label: string, length: number): Buffer {
  return createHash("sha256")
    .update(MASTER_SECRET)
    .update(label)
    .digest()
    .subarray(0, length);
}

const keysets: Keysets = {
  "1": {
    id: "1",
    skey: deriveKey("signing", 32),
    ekey: deriveKey("encryption", 32),
  },
};

(function () {
  const mode = process.argv[2];

  mkdirSync(OUT_DIR, { recursive: true });

  if (mode === "encode") {
    const payload = { msg: "hello world", ts: Date.now() };
    const token = ncrypt.encode(payload, keysets["1"]);
    writeFileSync(TOKEN_FILE, token, "utf-8");
    console.log("Wrote token to", TOKEN_FILE);
    console.log("Token:", token);
    process.exit(0);
  }

  if (mode === "decode") {
    if (!existsSync(TOKEN_FILE)) {
      console.error("No token file found. Run with --encode first.");
      process.exit(1);
    }
    const token = readFileSync(TOKEN_FILE, "utf-8").trim();
    console.log("Read token:", token);
    const result = ncrypt.decode(token, keysets);
    console.log("Decoded:", JSON.stringify(result));
    process.exit(0);
  }

  // default: both (same process – works)
  const payload = { msg: "hello world", ts: Date.now() };
  const token = ncrypt.encode(payload, keysets["1"]);
  writeFileSync(TOKEN_FILE, token, "utf-8");
  console.log("Encoded and written to", TOKEN_FILE);
  const readback = readFileSync(TOKEN_FILE, "utf-8").trim();
  const result = ncrypt.decode(readback, keysets);
  console.log("Decoded back:", JSON.stringify(result));
})()
