"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import Link from "next/link";

const DUMMY_PROJECTS = [
  {
    id: 1,
    title: "Sistema Solar 5kWp",
    neighborhood: "San Pedro Garza García",
    installer: "SolarTech MTY",
    system_size_kwp: 5,
    panel_count: 12,
    approx_cost_mxn: 85000,
    battery_included: false,
    whatsapp: "528112345678",
    lat: 25.6572,
    lng: -100.4023,
  },
  {
    id: 2,
    title: "Sistema Solar 8kWp + Batería",
    neighborhood: "Cumbres",
    installer: "Energía Verde NL",
    system_size_kwp: 8,
    panel_count: 20,
    approx_cost_mxn: 140000,
    battery_included: true,
    whatsapp: "528119876543",
    lat: 25.7641,
    lng: -100.3611,
  },
  {
    id: 3,
    title: "Sistema Solar 3kWp",
    neighborhood: "Valle Alto",
    installer: "SolarTech MTY",
    system_size_kwp: 3,
    panel_count: 8,
    approx_cost_mxn: 55000,
    battery_included: false,
    whatsapp: "528112345678",
    lat: 25.6190,
    lng: -100.2857,
  },
  {
    id: 4,
    title: "Sistema Solar 10kWp + Batería",
    neighborhood: "Santa Catarina",
    installer: "Sol y Watts",
    system_size_kwp: 10,
    panel_count: 25,
    approx_cost_mxn: 180000,
    battery_included: true,
    whatsapp: "528114567890",
    lat: 25.6731,
    lng: -100.4602,
  },
  {
    id: 5,
    title: "Sistema Solar 6kWp",
    neighborhood: "Apodaca",
    installer: "Energía Verde NL",
    system_size_kwp: 6,
    panel_count: 15,
    approx_cost_mxn: 98000,
    battery_included: false,
    whatsapp: "528119876543",
    lat: 25.7772,
    lng: -100.1880,
  },
];

export default function MapPage() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Monterrey, Nuevo León</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
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
            {DUMMY_PROJECTS.map((project) => (
              <AdvancedMarker
                key={project.id}
                position={{ lat: project.lat, lng: project.lng }}
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
                position={{ lat: selectedProject.lat, lng: selectedProject.lng }}
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
                    <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>💰 Aprox: ${selectedProject.approx_cost_mxn.toLocaleString()} MXN</p>
                    <p style={{ color: "#c8e6ff" }}>🏢 {selectedProject.installer}</p>
                  </div>
                  <a
                    href={`https://wa.me/${selectedProject.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", background: "#0d7a3e", color: "#fff", fontSize: "12px", fontWeight: "500", textAlign: "center", padding: "8px", borderRadius: "20px" }}
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}