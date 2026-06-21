import { createHash } from "node:crypto";

function deterministicAddress(name) {
  return `0x${createHash("sha256").update(`ZERO:${name}`).digest("hex").slice(0, 40)}`;
}

export function cdpSafeAccountName(name, role) {
  const rawName = `${name}-${role}`;
  const normalized = rawName
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized.length >= 2 && normalized.length <= 36) return normalized;

  const digest = createHash("sha256").update(rawName).digest("hex").slice(0, 8);
  const prefix = (normalized || "zero").slice(0, 27).replace(/-+$/g, "");
  return `${prefix}-${digest}`;
}

export class SimulatedWalletProvider {
  constructor() {
    this.mode = "SIMULATED";
  }

  async getOrCreateWallet(name, type = "eoa") {
    const ownerAddress = deterministicAddress(`${name}:owner`);
    return {
      id: `sim_${createHash("sha256").update(name).digest("hex").slice(0, 12)}`,
      name,
      type,
      address: type === "smart" ? deterministicAddress(`${name}:smart`) : ownerAddress,
      ownerAddress,
      provider: this.mode,
    };
  }
}

export class CDPWalletProvider {
  constructor() {
    this.mode = "CDP";
    this._clientPromise = null;
  }

  async client() {
    if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET || !process.env.CDP_WALLET_SECRET) {
      throw new Error("CDP_API_KEY_ID, CDP_API_KEY_SECRET and CDP_WALLET_SECRET are required");
    }
    if (!this._clientPromise) {
      this._clientPromise = import("@coinbase/cdp-sdk").then(({ CdpClient }) => new CdpClient());
    }
    return this._clientPromise;
  }

  async findSmartAccountByOwner(cdp, ownerAddress) {
    let pageToken;
    const normalizedOwner = ownerAddress.toLowerCase();

    do {
      const page = await cdp.evm.listSmartAccounts({ pageSize: 100, pageToken });
      const match = page.accounts.find((account) =>
        account.owners.some((address) => address.toLowerCase() === normalizedOwner),
      );
      if (match) return match;
      pageToken = page.nextPageToken;
    } while (pageToken);

    return null;
  }

  async getOrCreateWallet(name, type = "eoa") {
    const cdp = await this.client();
    const owner = await cdp.evm.getOrCreateAccount({ name: cdpSafeAccountName(name, "owner") });
    if (type !== "smart") {
      return { id: name, name, type, address: owner.address, ownerAddress: owner.address, provider: this.mode };
    }
    const smart = await this.findSmartAccountByOwner(cdp, owner.address)
      || await cdp.evm.getOrCreateSmartAccount({
        name: cdpSafeAccountName(name, "smart"),
        owner,
      });
    return { id: name, name, type, address: smart.address, ownerAddress: owner.address, provider: this.mode };
  }
}

export function walletProviderFromEnvironment() {
  return process.env.CDP_API_KEY_ID ? new CDPWalletProvider() : new SimulatedWalletProvider();
}
