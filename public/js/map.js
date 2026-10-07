if (!mapToken) {
  console.error("Mapbox token missing. .env mein MAP_TOKEN check karo.");
} else if (!listing.geometry || !listing.geometry.coordinates) {
  console.error("Is listing mein geometry nahi hai. Listing dobara create karo.");
} else {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // [lng, lat]
    zoom: 10,
  });

  map.addControl(new mapboxgl.NavigationControl());

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
      )
    )
    .addTo(map);
}