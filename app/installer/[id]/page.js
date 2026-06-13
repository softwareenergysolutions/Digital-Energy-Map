"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InstallerProfilePage() {
  const { id } = useParams();
  const [installer, setInstaller] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstaller = async () => {
      const { data: installerData } = await supabase
        .from("installers")
        .select("*")
        .eq("id", id)
        .single();

      setInstaller(installerData);

      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("installer_id", installerData?.user_id)
        .eq("approved", true)
        .order("created_at", { ascending: false });

      setProjects(projectsData || []);
      setLoading(false);
    };

    if (id) fetchInstaller();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4a90d9" }}>Cargando perfil...</p>
      </div>
    );
  }

  if (!installer) {
    return (
      <div style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>Instalador no encontrado.</p>
      </div>
    );
  }

  const totalKwp = projects.reduce((sum, p) => sum + (p.system_size_kwp || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Perfil de instalador</p>
        </div>
        <Link href="/map" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
          Ver mapa
        </Link>
      </header>

      <div style={{ padding: "32px 24px", maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "16px", padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "72px", height: "72px", background: "#1a3a6b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #f0c040" }}>
                <span style={{ color: "#f0c040", fontSize: "28px", fontWeight: "500" }}>
                  {installer.company_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 style={{ color: "#c8e6ff", fontSize: "24px", fontWeight: "500", marginBottom: "4px" }}>
                  {installer.company_name}
                </h2>
                <p style={{ color: "#4a90d9", fontSize: "13px", marginBottom: "4px" }}>
                  📍 {installer.city || "México"}
                  {installer.state ? `, ${installer.state}` : ""}
                </p>
                {installer.ance_certified && (
                  <span style={{ background: "#0d3a1e", color: "#4ade80", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", border: "1px solid #4ade80" }}>
                    ✓ Certificado ANCE
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {installer.whatsapp && (
                <a
                  href={`https://wa.me/${installer.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "#0d7a3e", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "10px 20px", borderRadius: "20px", textDecoration: "none" }}
                >
                  WhatsApp
                </a>
              )}
              {installer.website && (
                <a
                  href={installer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "13px", padding: "10px 20px", borderRadius: "20px", border: "1px solid #2a5a9b", textDecoration: "none" }}
                >
                  Sitio web
                </a>
              )}
            </div>
          </div>

          {installer.description && (
            <p style={{ color: "#7ec8f0", fontSize: "14px", lineHeight: "1.7", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #1a3a6b" }}>
              {installer.description}
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #1a3a6b" }}>
            {[
              { label: "Proyectos publicados", value: projects.length, color: "#f0c040" },
              { label: "kWp instalados", value: Math.round(totalKwp), color: "#4ade80" },
              { label: "Años de experiencia", value: installer.years_in_business || "—", color: "#7ec8f0" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#07111f", border: "1px solid #1a3a6b", borderRadius: "10px", padding: "16px" }}>
                <p style={{ color: "#4a90d9", fontSize: "11px", marginBottom: "6px" }}>{stat.label}</p>
                <p style={{ color: stat.color, fontSize: "24px", fontWeight: "500" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{ color: "#c8e6ff", fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
          Proyectos instalados
        </h3>

        {projects.length === 0 ? (
          <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#4a90d9", fontSize: "14px" }}>Este instalador aún no tiene proyectos publicados.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {projects.map((project) => (
              <div key={project.id} style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", overflow: "hidden" }}>
                {project.photo_url && (
                  <img
                    src={project.photo_url}
                    alt={project.title}
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  />
                )}
                <div style={{ padding: "16px" }}>
                  <p style={{ color: "#c8e6ff", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>{project.title}</p>
                  <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "10px" }}>
                    {project.neighborhood} — {project.city}
                  </p>
                  <div style={{ fontSize: "12px" }}>
                    <p style={{ color: "#7ec8f0", marginBottom: "3px" }}>⚡ {project.system_size_kwp} kWp — {project.panel_count} paneles</p>
                    <p style={{ color: "#7ec8f0", marginBottom: "3px" }}>🔋 Batería: {project.battery_included ? "Sí" : "No"}</p>
                    {project.approx_cost_mxn && (
                      <p style={{ color: "#7ec8f0" }}>💰 ${project.approx_cost_mxn.toLocaleString()} MXN</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}