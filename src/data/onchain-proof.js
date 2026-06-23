export const explorer = "https://sepolia.basescan.org";

export const onchainProof = {
  network: "Base Sepolia",
  chainId: 84532,
  contracts: {
    ZERO: "0xe5546454f7Be4796d2CF65d5F0399501Dca21aab",
    SettlementEscrow: "0x7f6510C4cD6Edc5F59F49ccD5792258e13Bad3D6",
    ApprovalEscrow: "0x4E719831f1e81730499B5E7e8a1f4B8A6E865d2E",
    EAS: "0x4200000000000000000000000000000000000021",
    SchemaRegistry: "0x4200000000000000000000000000000000000020",
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  actors: {
    treasury: "0x0834dE5d9bF523db274C77874ad3B1C4ec0e614C",
    verifier: "0x6bFAcC1f21E06843A189b540520614F9abfccd94",
    humanApprover: "0x5d8B442bfe432C06328Afc2a4E4b9Bb609301bB5",
    beneficiary: "0xe5C43B4AC4147f8Aab8A161E4259252618d7102b",
    x402Payer: "0x4ce18f7303CF69844bf8e1E6F83a220e64875F73",
    x402Provider: "0x96Df7fa9aC0f4dd1A6a493Df7743e0f3E816E334",
  },
  receipt: {
    programId: "0x492df59c1297d0da4351a017a982a08e0c26419ceddea3defddc61fdcb891ed4",
    receiptHash: "0x2283de8e774b989c84268bce1aa3a4938d42468d309e3daf0dd0617173ea8598",
    attestationUID: "0x586c4e3b19e204ce09eace285a1881bd318d9cf816b297b0989981510653aa72",
    amount: "2,400,000 ZERO",
    status: "SETTLED",
  },
  humanApproval: {
    standard: "EIP-712",
    escrow: "0x4E719831f1e81730499B5E7e8a1f4B8A6E865d2E",
    approver: "0x5d8B442bfe432C06328Afc2a4E4b9Bb609301bB5",
    digest: "0xf7d4617da10b3959c90a35068081d2fb67f22ba66eb4a4402e48083fcd2fc0dc",
    canarySettlement: "0x15bec10706faa00d891f78467fb2c37d9feed745edd6b5e0c4849a10515c4d36",
    amount: "1 ZERO safety canary",
    replayProtection: "per-approver nonce + consumed digest",
  },
  x402: {
    protocol: "x402-v2",
    asset: "USDC",
    amount: "0.001 USDC",
    payment: "0x5af11df3fa44a89a01d50caf0d65c6d16786a2eedec0712be112eed64f771ea9",
    blockNumber: 43161974,
  },
  transactions: [
    ["Program created", "0x7874963d47905c9e7b5a6068648c8c6505c7443ce90350e0a5ae5f6c850824f9"],
    ["Escrow funded", "0x8a8d2dadd6f681418a54da97518bfa12c9a86a34007c05626b74a9e57b6f3180"],
    ["EAS attestation", "0x8cefd61be25cd203d08fdfaa1c4a4f9adee10f3263e3b06ca84333504c642535"],
    ["Historical settlement", "0x346becdf17c0025f39acbf5353a406d26dcb2205d70d23e7683949e5b54b7f26"],
    ["EIP-712 canary settlement", "0x15bec10706faa00d891f78467fb2c37d9feed745edd6b5e0c4849a10515c4d36"],
    ["x402 evidence purchase", "0x5af11df3fa44a89a01d50caf0d65c6d16786a2eedec0712be112eed64f771ea9"],
  ],
};

export const txUrl = hash => `${explorer}/tx/${hash}`;
export const addressUrl = address => `${explorer}/address/${address}`;
export const short = value => value ? `${value.slice(0, 8)}…${value.slice(-6)}` : "—";
