// Standalone verification of the rate-limit module.
// Run: npx tsx scripts/verify-rate-limit.ts
// Doesn't call OpenRouter; pure logic test.

import { check, checkAll } from "../src/lib/rateLimit";

const FAIL = (m: string): never => {
  console.error("FAIL:", m);
  process.exit(1);
};

// 1. Single-window: 5 in 1s, 6th should fail.
{
  const cfg = { max: 5, windowMs: 1000, label: "test" };
  for (let i = 1; i <= 5; i++) {
    const d = check("ip-A", cfg);
    if (!d.ok) FAIL(`expected ok at #${i}`);
  }
  const d6 = check("ip-A", cfg);
  if (d6.ok) FAIL("expected 6th to be rejected");
  console.log(
    `OK single-window: 6th rejected (used=${d6.used}/${d6.limit}, reset=${d6.resetSeconds}s)`
  );
}

// 2. Independent IPs.
{
  const cfg = { max: 3, windowMs: 1000, label: "iso" };
  for (let i = 0; i < 3; i++) check("ip-A2", cfg);
  const d = check("ip-B2", cfg);
  if (!d.ok) FAIL("ip-B should not share ip-A's bucket");
  console.log("OK independent IPs");
}

// 3. checkAll: short window kicks in before long window.
{
  const cfgs = [
    { max: 2, windowMs: 1000, label: "1s" },
    { max: 100, windowMs: 60_000, label: "1m" },
  ];
  checkAll("ip-C", cfgs);
  checkAll("ip-C", cfgs);
  const d = checkAll("ip-C", cfgs);
  if (d.ok) FAIL("expected 3rd to be rejected by short window");
  if (d.label !== "1s") FAIL(`expected label=1s, got ${d.label}`);
  console.log(`OK checkAll: short window hit first (label=${d.label})`);
}

// 4. Window resets after time advances (wrap in async fn for top-level await).
async function windowResetCheck() {
  const cfg = { max: 1, windowMs: 50, label: "fast" };
  const a = check("ip-D", cfg);
  if (!a.ok) FAIL("first should pass");
  const b = check("ip-D", cfg);
  if (b.ok) FAIL("second should fail (same window)");
  await new Promise((r) => setTimeout(r, 80));
  const c = check("ip-D", cfg);
  if (!c.ok) FAIL("should pass after window expires");
  console.log("OK window reset after expiry");
}

windowResetCheck().then(() => {
  console.log("\nAll rate-limit verifications passed.");
});
