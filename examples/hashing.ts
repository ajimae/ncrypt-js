import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { ncrypt } from "../dist/ncrypt";

const OUT_DIR = process.cwd() + "/examples/out"
const HASH_FILE = OUT_DIR + "/hash.txt" as string

(function () {
  const mode = process.argv[2];
  mkdirSync(OUT_DIR, { recursive: true });

  if (mode === "generate") {
    const password = process.argv[3] || "mySecurePassword123";
    const hashed = ncrypt.generate(password);
    writeFileSync(HASH_FILE, hashed, "utf-8");
    console.log("Password :", password);
    console.log("Hash     :", hashed);
    process.exit(0);
  }

  if (mode === "verify") {
    if (!existsSync(HASH_FILE)) {
      console.error("No hash file found. Run with --generate first.");
      process.exit(1);
    }
    const password = process.argv[3] || "mySecurePassword123";
    const hashed = readFileSync(HASH_FILE, "utf-8").trim();
    const valid = ncrypt.verify(password, hashed);
    console.log("Password :", password);
    console.log("Hash     :", hashed);
    console.log("Valid    :", valid);
    process.exit(0);
  }

  // default: full demo
  const password = "mySecurePassword123";
  const hashed = ncrypt.generate(password);
  writeFileSync(HASH_FILE, hashed, "utf-8");
  console.log("Generated hash:", hashed);

  const valid = ncrypt.verify(password, hashed);
  console.log("Password valid:", valid);
  console.log("Wrong password:", ncrypt.verify("wrongPassword", hashed));
  console.log("Is hashed?    :", ncrypt.isHashed(hashed));
  console.log("Is plain text?:", ncrypt.isHashed(password));
})()
