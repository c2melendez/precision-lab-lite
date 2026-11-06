import { readFileSync } from "node:fs";

const audit = JSON.parse(readFileSync("npm-audit.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const vulnerabilities = audit.vulnerabilities ?? {};
const names = Object.keys(vulnerabilities).sort();
const total = audit.metadata?.vulnerabilities?.total ?? names.length;

if (total === 0 && names.length === 0) {
  process.stdout.write("Full dependency audit: no vulnerabilities reported.\n");
  process.exit(0);
}

const allowedPackages = {
  "@rollup/plugin-node-resolve": "16.0.3",
  deepmerge: "4.3.1",
  "vite-plugin-pwa": "2.0.0",
  "workbox-build": "7.4.1",
};
const expectedNames = Object.keys(allowedPackages).sort();
const advisoryUrl = "https://github.com/advisories/GHSA-gcqx-w48m-w2h4";
const directAdvisories = Object.entries(vulnerabilities).flatMap(([name, item]) =>
  (item.via ?? [])
    .filter((via) => via && typeof via === "object")
    .map((via) => ({ package: name, url: via.url, severity: via.severity })),
);

const sameNames =
  names.length === expectedNames.length &&
  names.every((name, index) => name === expectedNames[index]);
const onlyKnownAdvisory =
  directAdvisories.length === 1 &&
  directAdvisories[0].package === "deepmerge" &&
  directAdvisories[0].url === advisoryUrl;
const allLowSeverity = names.every((name) => vulnerabilities[name]?.severity === "low");
const allExpectedDevVersions = expectedNames.every((name) => {
  const entry = lock.packages?.["node_modules/" + name];
  return entry?.version === allowedPackages[name] && entry.dev === true;
});

if (
  !sameNames ||
  total !== expectedNames.length ||
  !onlyKnownAdvisory ||
  !allLowSeverity ||
  !allExpectedDevVersions
) {
  process.stderr.write(
    "Unexpected dependency audit findings. The full audit remains a hard gate until reviewed.\n" +
      JSON.stringify({ names, total, directAdvisories, allLowSeverity, allExpectedDevVersions }, null, 2) +
      "\n",
  );
  process.exit(1);
}

process.stdout.write(
  "Accepted only the documented development-tooling advisory GHSA-gcqx-w48m-w2h4 " +
    "for the exact four-package chain and reviewed versions. Full report is retained.\n",
);
