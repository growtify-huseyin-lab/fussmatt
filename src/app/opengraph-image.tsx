import { ImageResponse } from "next/og";

export const alt = "FussMatt - Premium Auto-Fussmatten";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)",
          position: "relative",
        }}
      >
        {/* Amber accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #d97706, #f59e0b, #d97706)",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            fuss
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#f59e0b",
              letterSpacing: "-2px",
            }}
          >
            matt
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#9ca3af",
            fontWeight: 400,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Premium Auto-Fussmatten
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 48,
          }}
        >
          {["3D & 5D Passform", "TPE Material", "DACH Versand"].map((text) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f59e0b",
                }}
              />
              <span style={{ fontSize: 20, color: "#d1d5db" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "#6b7280",
            letterSpacing: "2px",
          }}
        >
          fussmatt.com
        </div>

        {/* Amber accent line bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #d97706, #f59e0b, #d97706)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
