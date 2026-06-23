# ZERO — security and delivery check

Last checked: 2026-06-23.

## Secret scan

Command used:

```powershell
rg -n "(Cmsdy|CDP_API_KEY_SECRET\s*=\s*[^\s#]+|CDP_WALLET_SECRET\s*=\s*[^\s#]+|AWS_SECRET_ACCESS_KEY\s*=\s*[^\s#]+|PRIVATE_KEY\s*=\s*[^\s#]+|BEGIN (RSA|OPENSSH|PRIVATE)|sk-[A-Za-z0-9]|AKIA[0-9A-Z]{16})" . --glob '!node_modules/**' --glob '!dist/**'
```

Result:

- No committed Coinbase, AWS, OpenAI, wallet, private key or long-lived credential values were found.
- The only match was a false positive inside ordinary prose/package metadata.

## Sensitive configuration

Secrets must remain only in Vercel/AWS/Coinbase dashboards:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`
- `AWS_ROLE_ARN`
- `AWS_REGION`
- `ZERO_TABLE_NAME`
- `ZERO_DEMO_EVENT_ID`

Do not commit real values for these variables.

## Blockchain-backed proof

The product uses confirmed Base Sepolia references for the visible hackathon flow:

- ZERO token contract.
- Settlement escrow.
- Approval escrow.
- EAS contract and attestation.
- x402 USDC evidence payment.
- Historical 2,400,000 ZERO escrow settlement.
- EIP-712 human authorization safety canary.

`/api/agent-demo` now returns the confirmed Base Sepolia reference timeline instead of a simulated settlement run.

## Local-only test helpers

The repo still contains local/CI simulation helpers:

- `shared/x402-simulator.mjs`
- simulated wallet provider mode in `shared/agent-wallets.mjs`
- Ganache/local contract tests

These are retained for deterministic tests and local development. They should not be presented as the production blockchain proof path.

## Demo risk controls

- Production routes `/`, `/enter`, and `/app` are served by Vercel.
- SPA rewrites cover `/enter`, `/app`, and `/app/:path*`.
- Public app links should rely on Base Sepolia explorer URLs for judge verification.
- If live external API calls fail, the visible proof still resolves to immutable Base Sepolia transactions.
