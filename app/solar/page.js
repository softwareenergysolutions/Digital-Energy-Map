"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import Link from "next/link";

export default function SolarPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [solarData, setSolarData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [fluxUrl, setFluxUrl] = useState(null);
  const [fluxBounds, setFluxBounds] = useState(null);

  const CFE_RATE_PER_KWH = 3.5;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSolarData(null);
    setFluxUrl(null);
    setFluxBounds(null);

    try {
      const geocodeRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ", Monterrey, Nuevo León, México")}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const geocodeData = await geocodeRes.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        setError("No encontramos esa dirección. Intenta con una dirección más específica.");
        setLoading(false);
        return;
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;
      setCoordinates({ lat, lng });

      const solarRes = await fetch(
        `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=LOW&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      if (!solarRes.ok) {
        setError("No encontramos datos solares para esta dirección. Intenta con otra dirección cercana.");
        setLoading(false);
        return;
      }

      const solar = await solarRes.json();
      setSolarData(solar);

      const fluxLayerRes = await fetch(
        `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${lat}&location.longitude=${lng}&radiusMeters=100&view=FULL_LAYERS&requiredQuality=LOW&pixelSizeMeters=0.5&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );

      if (fluxLayerRes.ok) {
        const fluxLayerData = await fluxLayerRes.json();

        if (fluxLayerData.annualFluxUrl) {
          const response = await fetch(`/api/flux?lat=${lat}&lng=${lng}`);
          const arrayBuffer = await response.arrayBuffer();

          const geotiff = await import("geotiff");
          const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
          const image = await tiff.getImage();
          const data = await image.readRasters();
          const width = image.getWidth();
          const height = image.getHeight();

          const metersToLat = 1 / 111320;
          const metersToLng = 1 / (111320 * Math.cos(lat * Math.PI / 180));
          const radius = 100;

          setFluxBounds({
            north: lat + radius * metersToLat,
            south: lat - radius * metersToLat,
            east: lng + radius * metersToLng,
            west: lng - radius * metersToLng,
          });

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          const imageData = ctx.createImageData(width, height);

          const fluxValues = data[0];
          let min = Infinity;
          let max = -Infinity;
          for (let i = 0; i < fluxValues.length; i++) {
            if (fluxValues[i] > 0) {
              min = Math.min(min, fluxValues[i]);
              max = Math.max(max, fluxValues[i]);
            }
          }

          const getColor = (value) => {
            if (value <= 0) return [0, 0, 0, 0];
            const t = (value - min) / (max - min);
            if (t < 0.25) {
              const s = t / 0.25;
              return [0, 0, Math.round(128 + s * 127), 200];
            } else if (t < 0.5) {
              const s = (t - 0.25) / 0.25;
              return [0, Math.round(s * 255), 255, 200];
            } else if (t < 0.75) {
              const s = (t - 0.5) / 0.25;
              return [Math.round(s * 255), 255, Math.round(255 - s * 255), 200];
            } else {
              const s = (t - 0.75) / 0.25;
              return [255, Math.round(255 - s * 255), 0, 200];
            }
          };

          for (let i = 0; i < fluxValues.length; i++) {
            const [r, g, b, a] = getColor(fluxValues[i]);
            imageData.data[i * 4] = r;
            imageData.data[i * 4 + 1] = g;
            imageData.data[i * 4 + 2] = b;
            imageData.data[i * 4 + 3] = a;
          }

          ctx.putImageData(imageData, 0, 0);
          const pngUrl = canvas.toDataURL("image/png");
          setFluxUrl(pngUrl);
        }
      }

    } catch (err) {
      console.error("Error:", err);
      setError("Ocurrió un error. Por favor intenta de nuevo.");
    }

    setLoading(false);
  };

  const getBestConfig = () => {
    if (!solarData?.solarPotential?.solarPanelConfigs) return null;
    const configs = solarData.solarPotential.solarPanelConfigs;
    return configs[configs.length - 1];
  };

  const bestConfig = getBestConfig();
  const maxPanels = solarData?.solarPotential?.maxArrayPanelsCount || 0;
  const maxKwh = bestConfig?.yearlyEnergyDcKwh || 0;
  const annualSavings = Math.round(maxKwh * CFE_RATE_PER_KWH);
  const monthlySavings = Math.round(annualSavings / 12);
  const sunshineHours = solarData?.solarPotential?.maxSunshineHoursPerYear || 0;
  const roofArea = solarData?.solarPotential?.wholeRoofStats?.areaMeters2 || 0;

  const inputStyle = {
    background: "#0d1f38",
    border: "1px solid #1a3a6b",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#c8e6ff",
    fontSize: "15px",
    outline: "none",
    flex: 1,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07111f" }}>

      <header style={{ background: "#0a1628", borderBottom: "1px solid #1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#f0c040", fontSize: "20px", fontWeight: "500", letterSpacing: "2px" }}>VECINOSOLAR</h1>
          <p style={{ color: "#4a90d9", fontSize: "11px" }}>Potencial solar de tu hogar</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/map" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
            Ver mapa
          </Link>
          <Link href="/" style={{ background: "#1a3a6b", color: "#7ec8f0", fontSize: "12px", padding: "6px 14px", borderRadius: "6px", border: "1px solid #2a5a9b", textDecoration: "none" }}>
            Inicio
          </Link>
        </div>
      </header>

      <div style={{ padding: "48px 24px", maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ color: "#c8e6ff", fontSize: "32px", fontWeight: "500", marginBottom: "12px" }}>
            ¿Cuánto puedes ahorrar con <span style={{ color: "#f0c040" }}>energía solar?</span>
          </h2>
          <p style={{ color: "#7ec8f0", fontSize: "16px", lineHeight: "1.7" }}>
            Ingresa tu dirección y analizamos el potencial solar de tu techo en segundos.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", marginBottom: "48px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Ej: Av. Revolución 123, Cumbres"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: "#f0c040", color: "#07111f", fontWeight: "500", fontSize: "15px", padding: "12px 28px", borderRadius: "30px", border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}
          >
            {loading ? "Analizando..." : "Analizar techo"}
          </button>
        </form>

        {error && (
          <div style={{ background: "#3a0d0d", border: "1px solid #f87171", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>
          </div>
        )}

        {solarData && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Paneles máx.", value: maxPanels, unit: "paneles", color: "#f0c040" },
                { label: "Producción anual", value: Math.round(maxKwh).toLocaleString(), unit: "kWh/año", color: "#4ade80" },
                { label: "Ahorro mensual", value: `$${monthlySavings.toLocaleString()}`, unit: "MXN/mes", color: "#7ec8f0" },
                { label: "Ahorro anual", value: `$${annualSavings.toLocaleString()}`, unit: "MXN/año", color: "#f0c040" },
                { label: "Horas de sol", value: Math.round(sunshineHours).toLocaleString(), unit: "hrs/año", color: "#7ec8f0" },
                { label: "Área del techo", value: Math.round(roofArea), unit: "m²", color: "#4ade80" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ color: "#4a90d9", fontSize: "11px", marginBottom: "8px" }}>{stat.label}</p>
                  <p style={{ color: stat.color, fontSize: "24px", fontWeight: "500" }}>{stat.value}</p>
                  <p style={{ color: "#4a90d9", fontSize: "11px", marginTop: "4px" }}>{stat.unit}</p>
                </div>
              ))}
            </div>

            {coordinates && (
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #1a3a6b", marginBottom: "16px", height: "350px", position: "relative" }}>
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <Map
                    defaultCenter={coordinates}
                    defaultZoom={19}
                    mapTypeId="satellite"
                    mapId="vecinosolar-solar"
                    style={{ width: "100%", height: "100%" }}
                    onIdle={(map) => {
                      if (fluxUrl && fluxBounds && map) {
                        const googleMap = map.map;
                        if (googleMap && window.google) {
                          const bounds = new window.google.maps.LatLngBounds(
                            new window.google.maps.LatLng(fluxBounds.south, fluxBounds.west),
                            new window.google.maps.LatLng(fluxBounds.north, fluxBounds.east)
                          );
                          new window.google.maps.GroundOverlay(
                            fluxUrl,
                            bounds,
                            { opacity: 0.8 }
                          ).setMap(googleMap);
                        }
                      }
                    }}
                  >
                    <AdvancedMarker position={coordinates} />
                  </Map>
                </APIProvider>
              </div>
            )}

            {fluxUrl && (
              <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px" }}>
                <p style={{ color: "#7ec8f0", fontSize: "12px", marginBottom: "8px" }}>Mapa de radiación solar anual</p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {[
                    { color: "#00007f", label: "Bajo" },
                    { color: "#0000ff", label: "" },
                    { color: "#00ffff", label: "" },
                    { color: "#00ff00", label: "" },
                    { color: "#ffff00", label: "" },
                    { color: "#ff8000", label: "" },
                    { color: "#ff0000", label: "Alto" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                      <div style={{ width: "100%", height: "12px", background: item.color, borderRadius: i === 0 ? "4px 0 0 4px" : i === 6 ? "0 4px 4px 0" : "0" }} />
                      {item.label && <p style={{ color: "#4a90d9", fontSize: "10px", marginTop: "4px" }}>{item.label}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!fluxUrl && solarData && (
              <div style={{ background: "#0a1628", border: "1px solid #1a3a6b", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px" }}>
                <p style={{ color: "#7ec8f0", fontSize: "12px" }}>Vista satelital del techo — datos de radiación no disponibles para esta dirección exacta.</p>
              </div>
            )}

            <div style={{ background: "#0a1628", border: "1px solid #f0c040", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
              <p style={{ color: "#f0c040", fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}>
                ¿Listo para instalar?
              </p>
              <p style={{ color: "#7ec8f0", fontSize: "14px", marginBottom: "20px" }}>
                Conecta con instaladores verificados en Monterrey que ya tienen proyectos en tu colonia.
              </p>
              <Link
                href="/map"
                style={{ background: "#f0c040", color: "#07111f", fontWeight: "500", fontSize: "15px", padding: "12px 32px", borderRadius: "30px", textDecoration: "none" }}
              >
                Ver instaladores cercanos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}