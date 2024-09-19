// Creating the map object
let myWorldMap = L.map("map", {
    center: [0, 0],   // Center over the world
    zoom: 3  //Zoom level 3 to show entire worldmap.
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myWorldMap);

//Link to the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Function to determine the marker size based on earthquake magnitude
function markerMagnitudeSize(magnitude) {
    return magnitude * 4;
}

// Function to determine the color marker based on earthquake depth
function markerDepthColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
           depth >= -10 ? '#FEB24C' :  
                           '#FFEDA0';   // Default color in case none of the above condition met
}

//  using d3.json() to load the json from USGS site
d3.json(link).then(function (data) {
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    L.geoJSON(data, {
        // Create circle markers
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerMagnitudeSize(feature.properties.mag),
                fillColor: markerDepthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // Add popups
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                `<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`
            );
        }
    }).addTo(myWorldMap);

    // Adding legend to the bottomright of the map
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend"),
            depthLevels = [-10, 10, 30, 50, 70, 90]

        // Loop through the intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depthLevels.length; i++) {
            // Using 'markerDepthColor' function to get colors
            div.innerHTML +=
                "<i style='background: " + markerDepthColor(depth[i] + 1) + "'></i> " +
                depthLevels[i] + (depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(myWorldMap);
});