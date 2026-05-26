"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MapPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("approved", true);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Monterrey, Nuevo León — {loading ? "Cargando..." : `${projects.length} proyectos`}</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
  <Link href="/solar" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b" }}>
    🌞 Potencial solar
  </Link>
  <Link href="/auth/login" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b" }}>
    Iniciar sesión
  </Link>
  <Link href="/auth/signup" style={{ background: "#f0c040", color: "#07111f", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", fontWeight: "500" }}>
    Registrarse
  </Link>
</div>
      </header>

      <div style={{ flex: 1 }}>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={{ lat: 25.6866, lng: -100.3161 }}
            defaultZoom={11}
            mapId="vecinosolar-map"
            style={{ width: "100%", height: "100%" }}
          >
            {projects.map((project) => (
              <AdvancedMarker
                key={project.id}
                position={{ lat: project.latitude, lng: project.longitude }}
                onClick={() => setSelectedProject(project)}
              >
                <Pin
                  background="#f0c040"
                  borderColor="#ca9a20"
                  glyphColor="#07111f"
                />
              </AdvancedMarker>
            ))}

            {selectedProject && (
              <InfoWindow
                position={{ lat: selectedProject.latitude, lng: selectedProject.longitude }}
                onCloseClick={() => setSelectedProject(null)}
              >
                <div style={{ padding: "8px", maxWidth: "220px", background: "#0a1628", borderRadius: "8px" }}>
                  <h3 style={{ color: "#f0c040", fontWeight: "500", fontSize: "14px", marginBottom: "4px" }}>
                    {selectedProject.title}
                  </h3>
                  <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "10px" }}>
                    {selectedProject.neighborhood}
                  </p>
                  <div style={{ fontSize: "12px", marginBottom: "12px" }}>
                    <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>⚡ {selectedProject.system_size_kwp} kWp — {selectedProject.panel_count} paneles</p>
                    <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>🔋 Batería: {selectedProject.battery_included ? "Sí" : "No"}</p>
                    {selectedProject.approx_cost_mxn && (
                      <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>💰 Aprox: ${selectedProject.approx_cost_mxn.toLocaleString()} MXN</p>
                    )}
                  </div>
                  {selectedProject.homeowner_contact_optin && selectedProject.homeowner_whatsapp && (
                    <a
                      href={`https://wa.me/${selectedProject.homeowner_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", background: "#0d7a3e", color: "#fff", fontSize: "12px", fontWeight: "500", textAlign: "center", padding: "8px", borderRadius: "20px" }}
                    >
                      Contactar propietario
                    </a>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}