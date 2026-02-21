var map = L.map("map", {
  zoomSnap: 1,
  minZoom: 3,
}).setView([52.517389, 13.395131], 13);

// https://wiki.openstreetmap.org/wiki/Raster_tile_providers
const STADIA_KEY = "93cbe61f-dd4a-43b4-990f-06e305b3670e";

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
var openv = L.tileLayer("https://map-oepnv.de/xyz_tiles/{z}/{x}/{y}.png");
var stadia = L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=" + STADIA_KEY);

var osmde = L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png");
var memomaps = L.tileLayer("https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png");
var berlinsat = L.tileLayer("https://tiles.codefor.de/berlin/geoportal/luftbilder/2025-dop20rgb/{z}/{x}/{y}.png");

var osmfr = L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png");
var osmhot = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png");
var osmcyclosm = L.tileLayer("https://{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png");

var cycle = L.tileLayer("https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png");
var route = L.tileLayer("https://tools.geofabrik.de/osmi/tiles/routing/{z}/{x}/{y}.png");
var bus = L.tileLayer("https://tile.tracestrack.com/bus-route/{z}/{x}/{y}.png");

osmhot.addTo(map);

https: var baseMaps = {
  OSM: osm,
  // "ÖPNVmap Brandenburg": openv,
  "Stadia Smooth": stadia,
  // "OSM DE": osmde,
  // "OSM DE Transport": memomaps,
  "OSM DE Sattalite": berlinsat,
  // "OSM FR": osmfr,
  "OSM FR Humanitaire": osmhot,
  // "OSM FR Cyclosm": osmcyclosm,
};

var overlayMaps = {
  Cycling: cycle,
  Routing: route,
  // Bus: bus,
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

function createButton(label, container) {
  var btn = L.DomUtil.create("button", "", container);
  btn.setAttribute("type", "button");
  btn.innerHTML = label;
  return btn;
}

console.log(document.baseURI.replace(/3000\/$/, "5000/") + "route/v1");
var control = L.Routing.control({
  waypoints: [L.latLng(52.51, 13.395), L.latLng(52.52, 13.396)],
  // serviceUrl: "http://localhost:5000/route/v1",
  serviceUrl: document.baseURI.replace(/3000\/$/, "5000/") + "route/v1",
  routeWhileDragging: true,
  routeDragInterval: 100,
  // https://github.com/perliedman/leaflet-control-geocoder#api
  // geocoder: L.Control.Geocoder.nominatim(),
})
  .on("routingstart", (e) => {})
  .on("routesfound routingerror", () => {
    // map.closePopup();
  })
  .addTo(map);

map.on("click", function (e) {
  console.log(e.latlng);
  control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);

  // var container = L.DomUtil.create("div");
  // var btn = L.DomUtil.create("button", "", container);
  // btn.setAttribute("type", "button");
  // btn.innerHTML = "loading...";
  // L.popup().setContent(container).setLatLng(e.latlng).openOn(map);

  // var waypoints = this.getWaypoints();
  // this.setWaypoints(waypoints.reverse());
  // popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
});
