"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "test2@vecinosolar.com";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      fetchProjects();
    };

    getUser();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await supabase
      .from("projects")
      .update({ approved: true, status: "approved" })
      .eq("id", id);
    fetchProjects();
  };

  const handleReject = async (id) => {
    await supabase
      .from("projects")
      .update({ approved: false, status: "rejected" })
      .eq("id", id);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    fetchProjects();
  };

  const filtered = projects.filter(p => {
    if (filter === "pending") return p.status === "pending";
    if (filter === "approved") return p.approved === true;
    if (filter === "rejected") return p.status === "rejected";
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#4a90d9" }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Panel de administración</p>
        </div>
        <a href="/map" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b" }}>
          Ver mapa
        </a>
      </header>

      <div style={{ padding: "32px 24px", maxWidth: "1000px", margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total", count: projects.length, color: "#c8e6ff" },
            { label: "Pendientes", count: projects.filter(p => p.status === "pending").length, color: "#f0c040" },
            { label: "Aprobados", count: projects.filter(p => p.approved).length, color: "#4ade80" },
            { label: "Rechazados", count: projects.filter(p => p.status === "rejected").length, color: "#f87171" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px" }}>
              <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: "32px", fontWeight: "500" }}>{stat.count}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#f0c040" : "#1a3a6b",
                color: filter === f ? "#07111f" : "#7ec8f0",
                fontSize: "12px",
                padding: "6px 16px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontWeight: filter === f ? "500" : "400",
              }}
            >
              {f === "pending" ? "Pendientes" : f === "approved" ? "Aprobados" : f === "rejected" ? "Rechazados" : "Todos"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#4a90d9" }}>No hay proyectos en esta categoría</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((project) => (
              <div key={project.id} style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <p style={{ color: "#c8e6ff", fontSize: "15px", fontWeight: "500", marginBottom: "4px" }}>{project.title}</p>
                    <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "4px" }}>{project.neighborhood} — {project.system_size_kwp} kWp — {project.panel_count} paneles</p>
                    {project.approx_cost_mxn && (
                      <p style={{ color: "#4a90d9", fontSize: "12px" }}>💰 ${project.approx_cost_mxn.toLocaleString()} MXN</p>
                    )}
                  </div>
                  <span style={{
                    background: project.approved ? "#0d3a1e" : project.status === "rejected" ? "#3a0d0d" : "#2a1a00",
                    color: project.approved ? "#4ade80" : project.status === "rejected" ? "#f87171" : "#f0c040",
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    border: `1px solid ${project.approved ? "#4ade80" : project.status === "rejected" ? "#f87171" : "#f0c040"}`,
                    whiteSpace: "nowrap",
                  }}>
                    {project.approved ? "Aprobado" : project.status === "rejected" ? "Rechazado" : "Pendiente"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  {!project.approved && project.status !== "rejected" && (
                    <button
                      onClick={() => handleApprove(project.id)}
                      style={{ background: "#0d3a1e", color: "#4ade80", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid #4ade80", cursor: "pointer" }}
                    >
                      ✓ Aprobar
                    </button>
                  )}
                  {project.approved && (
                    <button
                      onClick={() => handleReject(project.id)}
                      style={{ background: "#3a0d0d", color: "#f87171", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid #f87171", cursor: "pointer" }}
                    >
                      ✕ Desaprobar
                    </button>
                  )}
                  {project.status === "rejected" && (
                    <button
                      onClick={() => handleApprove(project.id)}
                      style={{ background: "#0d3a1e", color: "#4ade80", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid #4ade80", cursor: "pointer" }}
                    >
                      ✓ Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{ background: "transparent", color: "#f87171", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid #f87171", cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                  <a
                    href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid #2a5a9b" }}
                  >
                    Ver en Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}