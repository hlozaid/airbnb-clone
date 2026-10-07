mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard-satellite",
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 10,
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.location}</h4><p>Location provide after booking</P`),
  )
  .addTo(map);
