// Create a new map
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Adding a tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(queryUrl, function(data) {
    console.log(data);

    // Create style function
    function markerStyle(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: markerColor(feature.properties.mag),
          color: "#000000",
          radius: markerRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
    // Set Color based on Magnitude
    function markerColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#ff3333";
        }
      }
      // Set Radius based on Magnitude
        function markerRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }

    // GeoJSON
    L.geoJson(data, {
        // Make circles
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // Marker style
        style: styleInfo,

        // bindPopup to each marker
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

});

