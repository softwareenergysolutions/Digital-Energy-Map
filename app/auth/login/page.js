"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (loginError) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#f0c040", fontSize: "28px", fontWeight: "500", letterSpacing: "2px", marginBottom: "8px" }}>
            VECINOSOLAR
          </h1>
          <p style={{ color: "#4a90d9", fontSize: "13px" }}>
            Plataforma de energía solar en Monterrey
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#7ec8f0", fontSize: "12px", marginBottom: "6px" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contacto@solartech.mx"
              style={{ width: "100%", background: "#0d1f38", border: "1px solid #1a3a6b", borderRadius: "8px", padding: "10px 14px", color: "#c8e6ff", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#7ec8f0", fontSize: "12px", marginBottom: "6px" }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tu contraseña"
              style={{ width: "100%", background: "#0d1f38", border: "1px solid #1a3a6b", borderRadius: "8px", padding: "10px 14px", color: "#c8e6ff", fontSize: "14px", outline: "none" }}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#f0c040", color: "#07111f", fontWeight: "500", fontSize: "15px", padding: "12px", borderRadius: "30px", border: "none", cursor: "pointer", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#4a90d9", marginTop: "1.5rem" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/auth/signup" style={{ color: "#f0c040", fontWeight: "500" }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </main>
  );
}