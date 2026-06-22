import { CdpClient } from "@coinbase/cdp-sdk";
import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { Contract, JsonRpcProvider } from "ethers";

const NETWORK = "eip155:84532";
const USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const provider = new JsonRpcProvider("https://sepolia.base.org", 84532, { staticNetwork: true });
const usdc = new Contract(USDC, ["function balanceOf(address) view returns (uint256)"], provider);

export class LiveX402Adapter {
  constructor({ resourceUrl = process.env.ZERO_X402_RESOURCE_URL } = {}) {
    if (!resourceUrl) throw new Error("ZERO_X402_RESOURCE_URL is required for live x402");
    this.resourceUrl = resourceUrl;
  }

  async purchase({ resource, payer, seller }) {
    const cdp = new CdpClient();
    const balance = await usdc.balanceOf(payer.address);
    let faucetTransaction;
    if (balance < 1_000n) {
      const faucet = await cdp.evm.requestFaucet({
        address: payer.address,
        network: "base-sepolia",
        token: "usdc",
        idempotencyKey: `zero-x402-usdc-${payer.address.toLowerCase()}`,
      });
      faucetTransaction = faucet.transactionHash;
      await provider.waitForTransaction(faucet.transactionHash, 1, 60_000);
    }

    const challengeResponse = await fetch(this.resourceUrl, { headers: { Accept: "application/json" } });
    if (challengeResponse.status !== 402 || !challengeResponse.headers.get("payment-required")) {
      throw new Error(`Expected an x402 challenge, received ${challengeResponse.status}`);
    }

    const signer = {
      address: payer.address,
      signTypedData: async ({ domain, types, primaryType, message }) => {
        const signed = await cdp.evm.signTypedData({ address: payer.address, domain, types, primaryType, message });
        return signed.signature;
      },
    };
    const client = new x402Client().register("eip155:*", new ExactEvmScheme(signer));
    const paidFetch = wrapFetchWithPayment(fetch, client);
    const response = await paidFetch(this.resourceUrl, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`x402 paid request failed with ${response.status}`);
    const observation = await response.json();
    const settlement = new x402HTTPClient(client).getPaymentSettleResponse(name => response.headers.get(name));
    if (!settlement?.success || !settlement.transaction) throw new Error("x402 settlement proof missing");

    return {
      protocol: "x402-v2",
      challenge: { status: 402, resource, amount: "$0.001", token: "USDC", network: NETWORK },
      payment: {
        payer: payer.address,
        payTo: seller?.address,
        transactionHash: settlement.transaction,
        status: "CONFIRMED",
        faucetTransaction,
      },
      resource: observation,
    };
  }
}
