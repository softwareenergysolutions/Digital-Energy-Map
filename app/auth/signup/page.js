"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("installers")
      .insert({
        user_id: data.user.id,
        company_name: formData.company_name,
        email: formData.email,
        whatsapp: formData.whatsapp,
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "420px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>☀️</div>
          <h2 style={{ color: "#f0c040", fontSize: "22px", fontWeight: "500", marginBottom: "8px" }}>
            ¡Cuenta creada!
          </h2>
          <p style={{ color: "#7ec8f0", fontSize: "14px", marginBottom: "24px" }}>
            Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
          </p>
          <Link
            href="/auth/login"
            style={{ display: "block", background: "#f0c040", color: "#07111f", fontWeight: "500", fontSize: "15px", padding: "12px", borderRadius: "30px", textAlign: "center" }}
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "420px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#f0c040", fontSize: "28px", fontWeight: "500", letterSpacing: "2px", marginBottom: "8px" }}>
            VECINOSOLAR
          </h1>
          <p style={{ color: "#4a90d9", fontSize: "13px" }}>
            Crea tu cuenta de instalador
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#7ec8f0", fontSize: "12px", marginBottom: "6px" }}>
              Nombre de la empresa
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              placeholder="SolarTech MTY"
              style={{ width: "100%", background: "#0d1f38", border: "1px solid #1a3a6b", borderRadius: "8px", padding: "10px 14px", color: "#c8e6ff", fontSize: "14px", outline: "none" }}
            />
          </div>

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
              WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="528112345678"
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
              placeholder="Mínimo 6 caracteres"
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#4a90d9", marginTop: "1.5rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" style={{ color: "#f0c040", fontWeight: "500" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}