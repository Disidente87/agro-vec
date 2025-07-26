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
          backgroundImage: "linear-gradient(to bottom, #f0fdf4, #dcfce7)",
          padding: "40px",
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
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#166534",
              margin: "0 0 20px 0",
            }}
          >
            🌱 Agro-bootcamp
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#15803d",
              margin: "0 0 30px 0",
              maxWidth: "600px",
            }}
          >
            Trazabilidad agrícola sobre blockchain Base L2
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "12px 24px",
                backgroundColor: "#16a34a",
                color: "white",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Dashboard
            </div>
            <div
              style={{
                padding: "12px 24px",
                backgroundColor: "#22c55e",
                color: "white",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Parcelas
            </div>
          </div>
          <p
            style={{
              fontSize: "16px",
              color: "#166534",
              marginTop: "30px",
              opacity: 0.8,
            }}
          >
            Hackathon Base L2 | Web3 + Agricultura
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 