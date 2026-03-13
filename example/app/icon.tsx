import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3ece3"
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 6,
            borderRadius: 10,
            border: "2px solid #ccb9a4",
            background: "#fffdfa",
            padding: "0 10px"
          }}
        >
          <div style={{ width: 28, height: 4, borderRadius: 999, background: "#8c511f" }} />
          <div style={{ width: 20, height: 4, borderRadius: 999, background: "#8c511f" }} />
          <div style={{ width: 28, height: 4, borderRadius: 999, background: "#8c511f" }} />
        </div>
      </div>
    ),
    size
  );
}
