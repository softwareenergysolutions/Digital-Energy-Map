"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [installer, setInstaller] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const { data: installerData } = await supabase
        .from("installers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setInstaller(installerData);

      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("installer_id", user.id)
        .order("created_at", { ascending: false });

      setProjects(projectsData || []);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4a90d9", fontSize: "16px" }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Panel de instalador</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link href="/map" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b" }}>
            Ver mapa
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: "transparent", color: "#f87171", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #f87171", cursor: "pointer" }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ padding: "32px 24px", maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ color: "#c8e6ff", fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
            Bienvenido, {installer?.company_name || "Instalador"}
          </h2>
          <p style={{ color: "#4a90d9", fontSize: "14px" }}>
            Gestiona tus proyectos solares desde aquí
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px" }}>
            <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "8px" }}>Total proyectos</p>
            <p style={{ color: "#f0c040", fontSize: "32px", fontWeight: "500" }}>{projects.length}</p>
          </div>
          <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px" }}>
            <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "8px" }}>Publicados</p>
            <p style={{ color: "#f0c040", fontSize: "32px", fontWeight: "500" }}>
              {projects.filter(p => p.approved).length}
            </p>
          </div>
          <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px" }}>
            <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "8px" }}>Pendientes</p>
            <p style={{ color: "#f0c040", fontSize: "32px", fontWeight: "500" }}>
              {projects.filter(p => !p.approved).length}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ color: "#c8e6ff", fontSize: "16px", fontWeight: "500" }}>Mis proyectos</h3>
          <Link
            href="/dashboard/upload"
            style={{ background: "#f0c040", color: "#07111f", fontSize: "13px", fontWeight: "500", padding: "8px 18px", borderRadius: "20px" }}
          >
            + Subir proyecto
          </Link>
        </div>

        {projects.length === 0 ? (
          <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#4a90d9", fontSize: "32px", marginBottom: "12px" }}>☀️</p>
            <p style={{ color: "#7ec8f0", fontSize: "16px", marginBottom: "8px" }}>No tienes proyectos aún</p>
            <p style={{ color: "#4a90d9", fontSize: "13px", marginBottom: "24px" }}>
              Sube tu primer proyecto para aparecer en el mapa
            </p>
            <Link
              href="/dashboard/upload"
              style={{ background: "#f0c040", color: "#07111f", fontSize: "13px", fontWeight: "500", padding: "10px 24px", borderRadius: "20px" }}
            >
              Subir primer proyecto
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div>
                  <p style={{ color: "#c8e6ff", fontSize: "15px", fontWeight: "500", marginBottom: "4px" }}>{project.title}</p>
                  <p style={{ color: "#4a90d9", fontSize: "12px" }}>{project.neighborhood} — {project.system_size_kwp} kWp</p>
                </div>
                <div>
                  <span style={{ background: project.approved ? "#0d3a1e" : "#1a2a0a", color: project.approved ? "#4ade80" : "#f0c040", fontSize: "11px", padding: "4px 10px", borderRadius: "20px", border: `1px solid ${project.approved ? "#4ade80" : "#f0c040"}` }}>
                    {project.approved ? "Publicado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}