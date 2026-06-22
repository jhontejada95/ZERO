import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";

const root = process.cwd();
const contractFiles = [
  "contracts/ZEROTestToken.sol",
  "contracts/ZEROSettlementEscrow.sol",
  "contracts/test/MockEAS.sol",
];

function resolveImport(importPath) {
  const candidates = [path.join(root, importPath), path.join(root, "node_modules", importPath)];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return { contents: fs.readFileSync(candidate, "utf8") };
  }
  return { error: `Import not found: ${importPath}` };
}

export function compileContracts() {
  const sources = Object.fromEntries(contractFiles.map((file) => [file, { content: fs.readFileSync(path.join(root, file), "utf8") }]));
  const input = {
    language: "Solidity",
    sources,
    settings: {
      evmVersion: "shanghai",
      viaIR: true,
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: resolveImport }));
  const failures = (output.errors || []).filter((item) => item.severity === "error");
  if (failures.length) throw new Error(failures.map((item) => item.formattedMessage).join("\n"));
  return output.contracts;
}

export function writeArtifacts(contracts, outputDirectory = path.join(root, "artifacts")) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const selectedContracts = [
    ["contracts/ZEROTestToken.sol", "ZEROTestToken"],
    ["contracts/ZEROSettlementEscrow.sol", "ZEROSettlementEscrow"],
  ];

  for (const [source, name] of selectedContracts) {
    const contract = contracts[source][name];
    fs.writeFileSync(path.join(outputDirectory, `${name}.json`), JSON.stringify({
      contractName: name,
      sourceName: source,
      abi: contract.abi,
      bytecode: `0x${contract.evm.bytecode.object}`,
    }, null, 2));
  }
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
  const contracts = compileContracts();
  if (process.argv.includes("--write")) writeArtifacts(contracts);
  const summary = Object.entries(contracts).flatMap(([file, values]) => Object.keys(values).map((name) => `${file}:${name}`));
  console.log(`Compiled ${summary.length} contracts\n${summary.join("\n")}`);
}
