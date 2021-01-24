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
    function markerStyle(features) {
        return {
          opacity: 0.5,
          fillOpacity: 0.5,
          fillColor: markerColor(features.properties.mag),
          color: "#000000",
          radius: markerRadius(features.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
    // Set Color based on Magnitude
    function markerColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#bd0026";
        case magnitude > 4:
          return "#f03b20";
        case magnitude > 3:
          return "#fd8d3c";
        case magnitude > 2:
          return "#feb24c";
        case magnitude > 1:
          return "#fed976";
        default:
          return "#ffffb2";
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
        pointToLayer: function(features, latlng) {
          return L.circleMarker(latlng);
        },
        // Marker style
        style: markerStyle,

        // bindPopup to each marker
        onEachFeature: function(features, layer) {
          layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);
        }
    }).addTo(myMap);

    // Create legend variable
    var legend = L.control({
        position: "bottomright"
      });
      
      // Legend function
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
    
        var mags = [0, 1, 2, 3, 4, 5];
    
    
      // Loop through the intervals of colors to append in legend
        for (var i = 0; i<mags.length; i++) {
          div.innerHTML +=
          "<i style='background: " + markerColor(i) + "'></i> " +
          mags[i] + (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
        }
        return div;
    
      };

      // Add legend to map
      legend.addTo(myMap);

});
