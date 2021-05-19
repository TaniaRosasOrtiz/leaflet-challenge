// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71], // 141.7784,37.7079
    zoom: 5
  });

// Mapbox layer
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

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    function styleInfo(feature) {
        return {
          opacity: 5,
          fillOpacity: .5,
          fillColor: getColor(feature.properties.mag),
          color: "black",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: .9
        };
      }
      // Set color 
        function getColor(mag) {
        switch (true) {
        case mag > 5:
          return "#9e0142";
        case mag > 4:
          return "#abdda4";
        case mag > 3:
          return "#e6f598";
        case mag > 2:
          return "#66c2a5";
        case mag > 1:
          return "#ffffbf";
        default:
          return "#3288bd";
        }
      }

      // Set radius
        function getRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 4;
      }


        // GeoJSON layer
        L.geoJson(data, {
          // Circle
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          },
          // Style
          style: styleInfo,
          // Popup marker
          onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          }
        }).addTo(myMap);
      
        // Legend
        var legend = L.control({
          position: "bottomright"
        });
      
        // Details for legend
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");
          var grades = [0, 1, 2, 3, 4, 5];
      
          // Create legend
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              "<i style='background: " + getColor(grades[i]+1) + "'></i> " +
              grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
          return div;
        };
        legend.addTo(myMap);
      });
