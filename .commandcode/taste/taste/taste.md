# Taste
- Writes terse, informal, lowercase instructions that state high-level intent (e.g. "add two template and then add support template") and leaves implementation detail to the agent. Confidence: 0.6
- Expects the agent to diagnose the root cause before fixing, and says so explicitly (e.g. "investigate and fix") rather than asking for a quick patch. Confidence: 0.45
- Reports bugs in terms of observable broken output with a concrete failing example (e.g. "breaking some complex script ঈশ্বরগঞ্জ শ+ব breaked") and expects that exact case to be reproduced and shown fixed. Confidence: 0.5
- Verifies work against the real deployment runtime (deploys to Cloudflare Workers) rather than trusting local dev — a local-only pass is not accepted as proof, so issues should be reproduced/validated on the actual worker runtime (workerd/`vite preview`). Confidence: 0.5
- Bun-based TypeScript project linted with Biome; expects changes to pass typecheck, lint, and build (`bunx tsc --noEmit`, `bunx biome check`, `bun --bun run build`) before being considered done. Confidence: 0.5
- Prefers fonts expressed as a CSS-style stack with a primary font plus script fallbacks (e.g. main "Inter", fall back to a Bengali font) rather than one font per script. Confidence: 0.5
- Prefers Inter as the main/primary Latin font. Confidence: 0.4
