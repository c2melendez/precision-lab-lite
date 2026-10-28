#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const dir = path.join("src", "engine", ".algebrite_fragments");
const parts = fs.readdirSync(dir).filter(f => f.startsWith("part") && f.endsWith(".txt")).sort();
const content = parts.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("");
const dest = path.join("src", "engine", "algebriteClient.ts");
fs.writeFileSync(dest, content);
console.log("assembled", dest, content.length, "chars");
if (!content.includes("MAX_LITERAL_FACTORIAL")) {
  console.error("missing MAX_LITERAL_FACTORIAL");
  process.exit(1);
}
if (!content.startsWith("import { verifyFactorResult }")) {
  console.error("bad start");
  process.exit(1);
}
