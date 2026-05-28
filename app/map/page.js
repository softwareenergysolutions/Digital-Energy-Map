"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const MEXICO_CENTER = { lat: 23.6345, lng: -102.5528 };
const MEXICO_ZOOM = 5;

function PlacesSearch({ onPlaceSelect }) {
  const inputRef = useRef(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "mx" },
      fields: ["geometry", "name", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.formatted_address || place.name,
        });
      }
    });

    return () => {
      if (window.google) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [placesLib]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Buscar colonia, ciudad, dirección..."
      style={{
        background: "#0d1f38",
        border: "1px solid #1a3a6b",
        borderRadius: "20px",
        padding: "6px 14px",
        color: "#c8e6ff",
        fontSize: "12px",
        outline: "none",
        width: "260px",
      }}
    />
  );
}

export default function MapPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(MEXICO_CENTER);
  const [mapZoom, setMapZoom] = useState(MEXICO_ZOOM);
  const [locationStatus, setLocationStatus] = useState("detecting");

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(loc);
          setMapZoom(13);
          setLocationStatus("found");
        },
        () => {
          setLocationStatus("denied");
        }
      );
    } else {
      setLocationStatus("unsupported");
    }
  }, []);

  const handlePlaceSelect = (place) => {
    setMapCenter({ lat: place.lat, lng: place.lng });
    setMapZoom(15);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>
            {loading ? "Cargando..." : `${projects.length} proyectos en México`}
            {locationStatus === "found" && " — Tu ubicación"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <PlacesSearch onPlaceSelect={handlePlaceSelect} />
          </APIProvider>
          <Link href="/solar" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
            🌞 Potencial solar
          </Link>
          <Link href="/auth/login" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
            Iniciar sesión
          </Link>
          <Link href="/auth/signup" style={{ background: "#f0c040", color: "#07111f", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", fontWeight: "500", textDecoration: "none" }}>
            Registrarse
          </Link>
        </div>
      </header>

      <div style={{ flex: 1 }}>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            onCameraChanged={(e) => {
              setMapCenter(e.detail.center);
              setMapZoom(e.detail.zoom);
            }}
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
                <div style={{ padding: "8px", maxWidth: "240px", background: "#0a1628", borderRadius: "8px" }}>

                  {selectedProject.photo_url && (
                    <img
                      src={selectedProject.photo_url}
                      alt={selectedProject.title}
                      style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
                    />
                  )}

                  <h3 style={{ color: "#f0c040", fontWeight: "500", fontSize: "14px", marginBottom: "4px" }}>
                    {selectedProject.title}
                  </h3>
                  <p style={{ color: "#4a90d9", fontSize: "12px", marginBottom: "10px" }}>
                    {selectedProject.neighborhood} — {selectedProject.city}, {selectedProject.state}
                  </p>
                  <div style={{ fontSize: "12px", marginBottom: "12px" }}>
                    <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>⚡ {selectedProject.system_size_kwp} kWp — {selectedProject.panel_count} paneles</p>
                    <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>🔋 Batería: {selectedProject.battery_included ? "Sí" : "No"}</p>
                    {selectedProject.approx_cost_mxn && (
                      <p style={{ color: "#c8e6ff", marginBottom: "4px" }}>💰 Aprox: ${selectedProject.approx_cost_mxn.toLocaleString()} MXN</p>
                    )}
                    {selectedProject.installation_date && (
                      <p style={{ color: "#c8e6ff" }}>📅 {new Date(selectedProject.installation_date).toLocaleDateString("es-MX", { year: "numeric", month: "long" })}</p>
                    )}
                  </div>

                  {selectedProject.homeowner_contact_optin && selectedProject.homeowner_whatsapp && (
                    <a
                      href={`https://wa.me/${selectedProject.homeowner_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", background: "#0d7a3e", color: "#fff", fontSize: "12px", fontWeight: "500", textAlign: "center", padding: "8px", borderRadius: "20px", textDecoration: "none" }}
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