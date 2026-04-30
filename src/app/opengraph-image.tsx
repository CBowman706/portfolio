import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Fetches a single weight of a Google Font and returns the raw font data
 * for Satori (the engine behind ImageResponse). The CSS API returns a
 * stylesheet whose `src: url(...)` points at the woff2 we actually need.
 */
async function loadGoogleFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}`;
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
      },
    })
  ).text();
  const fontUrl = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`Could not extract font URL for ${family}`);
  return await fetch(fontUrl).then((r) => r.arrayBuffer());
}

export default async function OpenGraphImage() {
  const [fontBold, fontMedium] = await Promise.all([
    loadGoogleFont("Inter", 800),
    loadGoogleFont("Inter", 500),
  ]);

  const BG = "#050608";
  const FG = "#ECEDEE";
  const ACCENT = "#5EEAD4";
  const MUTED = "rgba(236, 237, 238, 0.65)";
  const SUBTLE = "rgba(236, 237, 238, 0.45)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          padding: 80,
          color: FG,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Soft accent glow, top-right — matches the hero on the live site */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -260,
            width: 720,
            height: 720,
            background:
              "radial-gradient(circle, rgba(94,234,212,0.28) 0%, rgba(94,234,212,0.08) 40%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Faint grid line accent, bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -180,
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle, rgba(94,234,212,0.10) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top brand row: pulse dot + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: ACCENT,
              boxShadow: "0 0 32px 6px rgba(94,234,212,0.55)",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: MUTED,
              letterSpacing: 1.2,
              display: "flex",
            }}
          >
            cortneybowman.dev
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Hero block: name + role + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 116,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              display: "flex",
            }}
          >
            {profile.name}.
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 500,
              color: ACCENT,
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            {profile.title}
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: MUTED,
              maxWidth: 980,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {profile.tagline}
          </div>
        </div>

        {/* Bottom: subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 48,
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 28,
              height: 2,
              background: ACCENT,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: SUBTLE,
              letterSpacing: 0.5,
              display: "flex",
            }}
          >
            {profile.subtitle}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: fontBold, weight: 800, style: "normal" },
        { name: "Inter", data: fontMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
