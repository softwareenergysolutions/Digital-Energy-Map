"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";

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
    <div className="flex flex-col h-screen">
      <header className="bg-yellow-500 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">VecinoSolar</h1>
        <p className="text-sm">Monterrey, Nuevo León</p>
      </header>

      <div className="flex-1">
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
                  background="#EAB308"
                  borderColor="#CA8A04"
                  glyphColor="#ffffff"
                />
              </AdvancedMarker>
            ))}

            {selectedProject && (
              <InfoWindow
                position={{ lat: selectedProject.lat, lng: selectedProject.lng }}
                onCloseClick={() => setSelectedProject(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-base mb-1">{selectedProject.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedProject.neighborhood}</p>
                  <div className="text-sm space-y-1 mb-3">
                    <p>⚡ {selectedProject.system_size_kwp} kWp — {selectedProject.panel_count} paneles</p>
                    <p>🔋 Batería: {selectedProject.battery_included ? "Sí" : "No"}</p>
                    <p>💰 Aprox: ${selectedProject.approx_cost_mxn.toLocaleString()} MXN</p>
                    <p>🏢 Instalador: {selectedProject.installer}</p>
                  </div>
                  <a
                    href={`https://wa.me/${selectedProject.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-full"
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