import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#07111f", fontFamily: "sans-serif" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Monterrey, Nuevo León</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/auth/login" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
            Iniciar sesión
          </Link>
          <Link href="/auth/signup" style={{ background: "#f0c040", color: "#07111f", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", fontWeight: "500", textDecoration: "none" }}>
            Registrarse
          </Link>
        </div>
      </header>

      <section style={{ padding: "80px 24px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid #2a5a9b", marginBottom: "24px" }}>
          🌞 Plataforma solar #1 en Monterrey
        </div>
        <h2 style={{ color: "#c8e6ff", fontSize: "48px", fontWeight: "500", lineHeight: "1.2", marginBottom: "24px" }}>
          Descubre los proyectos<br />
          <span style={{ color: "#f0c040" }}>solares de tus vecinos</span>
        </h2>
        <p style={{ color: "#7ec8f0", fontSize: "18px", lineHeight: "1.7", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
          Explora el mapa de Monterrey y ve qué sistemas solares tienen tus vecinos, cuánto pagaron y con qué empresa los instalaron.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/map" style={{ background: "#f0c040", color: "#07111f", fontSize: "16px", fontWeight: "500", padding: "14px 32px", borderRadius: "30px", textDecoration: "none" }}>
            Explorar el mapa
          </Link>
          <Link href="/auth/signup" style={{ background: "transparent", color: "#7ec8f0", fontSize: "16px", padding: "14px 32px", borderRadius: "30px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
            Soy instalador →
          </Link>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "#0a1628", borderTop: "1px solid #1a3a6b", borderBottom: "1px solid #1a3a6b" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h3 style={{ color: "#c8e6ff", fontSize: "28px", fontWeight: "500", textAlign: "center", marginBottom: "8px" }}>
            ¿Cómo funciona?
          </h3>
          <p style={{ color: "#4a90d9", fontSize: "14px", textAlign: "center", marginBottom: "48px" }}>
            Tres pasos para encontrar tu instalador ideal
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              { number: "01", title: "Explora el mapa", description: "Ve todos los proyectos solares instalados en colonias de Monterrey en tiempo real." },
              { number: "02", title: "Conoce los detalles", description: "Haz clic en cualquier pin para ver tamaño del sistema, paneles, costo aproximado y más." },
              { number: "03", title: "Contacta al instalador", description: "Escríbele directamente por WhatsApp al instalador que hizo el proyecto de tu vecino." },
            ].map((step) => (
              <div key={step.number} style={{ background: "#07111f", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "28px" }}>
                <p style={{ color: "#f0c040", fontSize: "32px", fontWeight: "500", marginBottom: "12px" }}>{step.number}</p>
                <p style={{ color: "#c8e6ff", fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>{step.title}</p>
                <p style={{ color: "#7ec8f0", fontSize: "14px", lineHeight: "1.6" }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h3 style={{ color: "#c8e6ff", fontSize: "28px", fontWeight: "500", textAlign: "center", marginBottom: "8px" }}>
            ¿Eres instalador solar?
          </h3>
          <p style={{ color: "#4a90d9", fontSize: "14px", textAlign: "center", marginBottom: "48px" }}>
            Muestra tus proyectos y consigue más clientes
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "48px" }}>
            {[
              { icon: "📍", title: "Aparece en el mapa", description: "Tus proyectos visibles para miles de vecinos curiosos." },
              { icon: "💬", title: "Leads por WhatsApp", description: "Clientes potenciales te contactan directamente sin intermediarios." },
              { icon: "⭐", title: "Construye reputación", description: "Proyectos reales verificados generan más confianza que cualquier anuncio." },
              { icon: "🆓", title: "Gratis en beta", description: "Durante el lanzamiento en Monterrey el registro es completamente gratis." },
            ].map((benefit) => (
              <div key={benefit.title} style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>{benefit.icon}</p>
                <p style={{ color: "#c8e6ff", fontSize: "15px", fontWeight: "500", marginBottom: "8px" }}>{benefit.title}</p>
                <p style={{ color: "#7ec8f0", fontSize: "13px", lineHeight: "1.6" }}>{benefit.description}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href="/auth/signup" style={{ background: "#f0c040", color: "#07111f", fontSize: "16px", fontWeight: "500", padding: "14px 40px", borderRadius: "30px", textDecoration: "none" }}>
              Registrar mi empresa gratis
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ background: "#0a1628", borderTop: "1px solid #1a3a6b", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#f0c040", fontSize: "16px", fontWeight: "500", letterSpacing: "2px", marginBottom: "8px" }}>VECINOSOLAR</p>
        <p style={{ color: "#4a90d9", fontSize: "12px" }}>Monterrey, Nuevo León — 2026</p>
      </footer>

    </div>
  );
}