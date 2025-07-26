import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0fdf4",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              marginBottom: "10px",
            }}
          >
            🌱
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#166534",
              margin: "0",
            }}
          >
            Agro-bootcamp
          </h1>
        </div>
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  )
} 