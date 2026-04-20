import { ImageResponse } from "next/og";

// Favicon: black square with red crosshair/target
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* outer ring */}
        <div
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            border: "2px solid #ef4444",
            borderRadius: "50%",
            display: "flex",
          }}
        />
        {/* horizontal crosshair */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 2,
            background: "#ef4444",
            display: "flex",
          }}
        />
        {/* vertical crosshair */}
        <div
          style={{
            position: "absolute",
            width: 2,
            height: 28,
            background: "#ef4444",
            display: "flex",
          }}
        />
        {/* center dot */}
        <div
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            background: "#ef4444",
            borderRadius: "50%",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
