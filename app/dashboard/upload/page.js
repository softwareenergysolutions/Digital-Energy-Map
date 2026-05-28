"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    neighborhood: "",
    latitude: "",
    longitude: "",
    system_size_kwp: "",
    panel_count: "",
    battery_included: false,
    battery_capacity_kwh: "",
    installation_date: "",
    approx_cost_mxn: "",
    homeowner_contact_optin: false,
    homeowner_whatsapp: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let photoUrl = null;

    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-photos")
        .upload(fileName, photoFile);

      if (uploadError) {
        setError("Error al subir la foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("project-photos")
        .getPublicUrl(fileName);

      photoUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from("projects")
      .insert({
        installer_id: user.id,
        title: formData.title,
        description: formData.description,
        neighborhood: formData.neighborhood,
        city: "Monterrey",
        state: "Nuevo León",
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        system_size_kwp: parseFloat(formData.system_size_kwp),
        panel_count: parseInt(formData.panel_count),
        battery_included: formData.battery_included,
        battery_capacity_kwh: formData.battery_capacity_kwh ? parseFloat(formData.battery_capacity_kwh) : null,
        installation_date: formData.installation_date || null,
        approx_cost_mxn: formData.approx_cost_mxn ? parseInt(formData.approx_cost_mxn) : null,
        homeowner_contact_optin: formData.homeowner_contact_optin,
        homeowner_whatsapp: formData.homeowner_whatsapp || null,
        photo_url: photoUrl,
        status: "pending",
        approved: false,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard?uploaded=true");
  };

  const inputStyle = {
    width: "100%",
    background: "#0d1f38",
    border: "1px solid #1a3a6b",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#c8e6ff",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    color: "#7ec8f0",
    fontSize: "12px",
    marginBottom: "6px",
  };

  const sectionStyle = {
    background: "#0a1628",
    border: "1px solid #1a3a6b",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  };

  const sectionTitleStyle = {
    color: "#f0c040",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #1a3a6b",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Subir nuevo proyecto</p>
        </div>
        <Link href="/dashboard" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
          Volver al dashboard
        </Link>
      </header>

      <div style={{ padding: "32px 24px", maxWidth: "700px", margin: "0 auto" }}>

        <h2 style={{ color: "#c8e6ff", fontSize: "20px", fontWeight: "500", marginBottom: "8px" }}>
          Nuevo proyecto solar
        </h2>
        <p style={{ color: "#4a90d9", fontSize: "13px", marginBottom: "24px" }}>
          Este proyecto aparecerá en el mapa después de ser revisado.
        </p>

        <form onSubmit={handleSubmit}>

          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Información general</p>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Título del proyecto *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Sistema Solar 5kWp — Cumbres"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el proyecto brevemente..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Colonia *</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
                placeholder="Cumbres, San Pedro, Valle Alto..."
                style={inputStyle}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Foto del proyecto</p>
            <div
              onClick={() => document.getElementById("photo-input").click()}
              style={{
                border: "2px dashed #1a3a6b",
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
                cursor: "pointer",
                background: photoPreview ? "transparent" : "#0d1f38",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
              ) : (
                <div>
                  <p style={{ color: "#f0c040", fontSize: "32px", marginBottom: "8px" }}>📷</p>
                  <p style={{ color: "#7ec8f0", fontSize: "14px", marginBottom: "4px" }}>Haz clic para subir una foto</p>
                  <p style={{ color: "#4a90d9", fontSize: "12px" }}>JPG, PNG — máx 10MB</p>
                </div>
              )}
            </div>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            {photoPreview && (
              <button
                type="button"
                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                style={{ background: "transparent", color: "#f87171", fontSize: "12px", padding: "6px 0", border: "none", cursor: "pointer", marginTop: "8px" }}
              >
                Eliminar foto
              </button>
            )}
          </div>

          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Ubicación en el mapa</p>
            <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "16px" }}>
              Para obtener coordenadas: abre Google Maps, haz clic derecho en la ubicación y copia las coordenadas.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Latitud *</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  step="any"
                  placeholder="25.6866"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Longitud *</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  step="any"
                  placeholder="-100.3161"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Detalles técnicos</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Tamaño del sistema (kWp) *</label>
                <input
                  type="number"
                  name="system_size_kwp"
                  value={formData.system_size_kwp}
                  onChange={handleChange}
                  required
                  step="0.1"
                  placeholder="5.5"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Número de paneles *</label>
                <input
                  type="number"
                  name="panel_count"
                  value={formData.panel_count}
                  onChange={handleChange}
                  required
                  placeholder="14"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <input
                type="checkbox"
                name="battery_included"
                checked={formData.battery_included}
                onChange={handleChange}
                id="battery"
                style={{ width: "16px", height: "16px", accentColor: "#f0c040" }}
              />
              <label htmlFor="battery" style={{ color: "#7ec8f0", fontSize: "13px" }}>
                ¿Incluye batería?
              </label>
            </div>

            {formData.battery_included && (
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Capacidad de batería (kWh)</label>
                <input
                  type="number"
                  name="battery_capacity_kwh"
                  value={formData.battery_capacity_kwh}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="10"
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Fecha de instalación</label>
                <input
                  type="date"
                  name="installation_date"
                  value={formData.installation_date}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Costo aproximado (MXN)</label>
                <input
                  type="number"
                  name="approx_cost_mxn"
                  value={formData.approx_cost_mxn}
                  onChange={handleChange}
                  placeholder="85000"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Contacto del propietario (opcional)</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <input
                type="checkbox"
                name="homeowner_contact_optin"
                checked={formData.homeowner_contact_optin}
                onChange={handleChange}
                id="optin"
                style={{ width: "16px", height: "16px", accentColor: "#f0c040" }}
              />
              <label htmlFor="optin" style={{ color: "#7ec8f0", fontSize: "13px" }}>
                El propietario acepta ser contactado por vecinos interesados
              </label>
            </div>

            {formData.homeowner_contact_optin && (
              <div>
                <label style={labelStyle}>WhatsApp del propietario</label>
                <input
                  type="text"
                  name="homeowner_whatsapp"
                  value={formData.homeowner_whatsapp}
                  onChange={handleChange}
                  placeholder="528112345678"
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#f0c040", color: "#07111f", fontWeight: "500", fontSize: "15px", padding: "14px", borderRadius: "30px", border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Subiendo proyecto..." : "Subir proyecto al mapa"}
          </button>

        </form>
      </div>
    </div>
  );
}