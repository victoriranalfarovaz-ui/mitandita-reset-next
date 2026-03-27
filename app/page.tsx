export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FF7A00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src="/logo.png"
          alt="MiTandita"
          style={{
            width: 150,
            height: 150,
            objectFit: "contain",
            display: "block",
            margin: "0 auto 10px",
          }}
        />

        <h1 style={{ marginBottom: 10 }}>MiTandita</h1>

        <p style={{ color: "#666", marginBottom: 20 }}>
          Página de recuperación de contraseña
        </p>

        <a
          href="/update-password"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
            background: "#FF7A00",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Ir a cambiar contraseña
        </a>
      </div>
    </main>
  );
}
