/*  George Ng
  INFO 343 C

  This is the javascript file that implements the map functions
   as well as handles the table data. */

var data;
var map;
var nWomen = 0;
var nMen = 0;
var wMen = 0;
var wWomen = 0;

// Function to draw your map
var drawMap = function() {

  // Create map and set view
  map = L.map('container').setView([39.82, -98.58], 4);

  // Create a tile layer variable using the appropriate url
  var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

  // Add the layer to your map
 	layer.addTo(map);

  // Execute your function to get data
  getData();
}

// Function for getting data
var getData = function() {
  // Execute an AJAX request to get the data in data/response.js
  $.ajax({
    url:'../data/response.json',
    type: "get",
    success:function(dat) {
      data = dat;
      customBuild();
    },
    dataType: "json"
  })

  // When your request is successful, call your customBuild function
}

// Loop through your data and add the appropriate layers and points
var customBuild = function() {

  //Layer groups for the various races
  var white = new L.LayerGroup([]);
  var asian = new L.LayerGroup([]);
  var black = new L.LayerGroup([]);
  var amIndian = new L.LayerGroup([]);
  var hawaiian = new L.LayerGroup([]);
  var unknown = new L.LayerGroup([]);

  for (i = 0; i < data.length; i++){
    var circle = new L.circleMarker([data[i].lat, data[i].lng]).bindPopup(data[i].Summary);
    
    //Creates counts for White/Non-white Men and Women
    if (data[i]["Victim's Gender"] == "Male") {
      if (data[i].Race == "White") {
        wMen++;
      } else {
        nMen++;
      }
    } else {
      if (data[i].Race == "White") {
        wWomen++;
      } else {
        nWomen++;
      }
    }

    buildTable();

    //Red if killed, gray if not
    if (data[i]["Hit or Killed?"] == "Killed") {
      circle.options.fillColor = '#ff0000';
      circle.options.color = '#ff0000';
    } else {
      circle.options.fillColor = '#808080';
      circle.options.color = '#808080';
    } 

    //Builds layer groups based on race
    if (data[i].Race == "White") {
      white.addLayer(circle);
    } else if (data[i].Race == "Black or African American") {
      black.addLayer(circle);
    } else if (data[i].Race == "Asian") {
      asian.addLayer(circle);
    } else if (data[i].Race == "American Indian or Alaska Native") {
      amIndian.addLayer(circle);
    } else if (data[i].Race == "Native Hawaiian or Other Pacific Islander") {
      hawaiian.addLayer(circle);
    } else {
      unknown.addLayer(circle);
    }
  } 

  //Adds layers to map initially
  white.addTo(map);
  black.addTo(map);
  asian.addTo(map);
  amIndian.addTo(map);
  hawaiian.addTo(map);
  unknown.addTo(map);

  //Creates an overlay with the various layers
  var overlay = {
    "White" : white,
    "Black or African American" : black,
    "Asian" : asian,
    "American Indian or Alaska Native" : amIndian,
    "Native Hawaiian or Other Pacific Islander" : hawaiian,
    "Unknown" : unknown
  };

	// Once layers are on the map, add a leaflet controller that shows/hides layers
  L.control.layers(null, overlay).addTo(map);

}

//This method inputs the data into the table
var buildTable = function() {
  document.getElementById("whiteMen").innerHTML = wMen;
  document.getElementById("whiteWomen").innerHTML = wWomen;
  document.getElementById("notWhiteMen").innerHTML = nMen;
  document.getElementById("notWhiteWomen").innerHTML = nWomen;
}


