# Intent Exchange

> A safe, explainable commerce agent for the Razorpay AI Buildathon — AI Growth & Agentic Commerce.

Intent Exchange turns a buyer's natural-language request into bounded purchase constraints, compares eligible merchant offers, and gates every payment behind explicit buyer approval. AI never has authority to spend money.

## Why it is safe

| Layer | Responsibility | Authority |
| --- | --- | --- |
| AI extractor | Interprets typed constraints | Cannot choose an offer or create a payment |
| Deterministic policy | Checks budget, availability, delivery, warranty, returns | Cannot exceed buyer constraints |
| Human gate | Shows merchant, product, maximum spend | Buyer must approve |
| Payment service | Creates and verifies a Razorpay test order | Never fulfils unverified payment |

## Run

```bash
npm install
copy .env.example .env
npm start
```

Open `http://localhost:3000`.

The app works in safe demo mode without credentials. To enable Razorpay test checkout, add test-only values to `.env`:

```dotenv
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Optionally add `OPENAI_API_KEY` to enable structured AI extraction. If no key is configured or the request fails, the app records why and safely uses deterministic extraction.

## Demo story

1. Enter a buyer request.
2. Inspect the explained offer ranking.
3. Approve the exact maximum spend.
4. Run Razorpay test checkout or the clearly labelled mock flow.
5. Show **Demo price drift** and **Simulate recovery case** for graceful failure handling.

## Security decisions

- Razorpay secrets remain server-only.
- Provider orders are created server-side and require an idempotency key.
- Checkout signatures and raw webhook payloads are HMAC-verified server-side.
- The audit trail exposes every decision and recovery state.
- Merchant data is synthetic; this is a prototype, not a real marketplace.

The `backend/` and video-processing folders are legacy experiments, not part of this demo. Do not include them when creating the public Buildathon repository.

Read [architecture](docs/ARCHITECTURE.md), [decisions](docs/DECISIONS.md), and the [five-minute pitch](docs/PITCH.md).
