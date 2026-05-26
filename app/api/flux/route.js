export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  try {
    const layersRes = await fetch(
      `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${lat}&location.longitude=${lng}&radiusMeters=100&view=FULL_LAYERS&requiredQuality=LOW&pixelSizeMeters=0.5&key=${apiKey}`
    );

    if (!layersRes.ok) {
      return Response.json({ error: "No flux data available" }, { status: 404 });
    }

    const layersData = await layersRes.json();

    if (!layersData.annualFluxUrl) {
      return Response.json({ error: "No annual flux URL" }, { status: 404 });
    }

    const tiffRes = await fetch(
      `${layersData.annualFluxUrl}&key=${apiKey}`
    );

    if (!tiffRes.ok) {
      return Response.json({ error: "Could not fetch flux image" }, { status: 500 });
    }

    const buffer = await tiffRes.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/tiff",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}