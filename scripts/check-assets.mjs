import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const source = readFileSync("src/content.js", "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: "src/content.js" });

const refs = new Set();
const walk = (value) => {
  if (Array.isArray(value)) {
    value.forEach(walk);
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach(walk);
    return;
  }

  if (typeof value === "string" && value.startsWith("./public/assets/wix/")) {
    refs.add(value);
  }
};

walk(context.window.AITUSA_DATA);

const missing = [...refs].filter((ref) => !existsSync(path.resolve(ref)));

console.log(`asset refs ${refs.size} missing ${missing.length}`);
if (missing.length) {
  console.log(missing.join("\n"));
  process.exit(1);
}
