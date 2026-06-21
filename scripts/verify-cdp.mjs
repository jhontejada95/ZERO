const requiredVariables = [
  "CDP_API_KEY_ID",
  "CDP_API_KEY_SECRET",
  "CDP_WALLET_SECRET",
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  console.error(`Missing required variables: ${missingVariables.join(", ")}`);
  process.exit(1);
}

try {
  const { CdpClient } = await import("@coinbase/cdp-sdk");
  const client = new CdpClient();
  const result = await client.evm.listAccounts();

  console.log("CDP authentication: OK");
  console.log(`EVM accounts visible: ${result.accounts.length}`);
} catch (error) {
  console.error(`CDP authentication: FAILED (${error?.name || "Error"})`);
  process.exit(1);
}
