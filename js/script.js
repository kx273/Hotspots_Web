var basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
var geojson;

//initial content in information window
$('#infoWindow').html('Information Window<br />Updates as you hover over a tract');

//initialize map1
var map1 = L.map('map1', {
scrollWheelZoom: true
}).setView([40.762433, -73.927496], 12);

//CartoDB Basemap
L.tileLayer(basemapUrl,{
	attribution: attribution
}).addTo(map1);

//get geojson data file and add data to map
$.getJSON('data/manhattan.geojson', function(redi_data) {
  geojson = L.geoJson(redi_data,{
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map1);
});

//this function takes a value and returns a color based on which bucket the value falls in
function getColor(d) {
  return d < 15 ? '#F81B05' :
         d < 45 ? '#F89105' :
         d < 90 ? '#F8F105' :
         d < 180 ? '#D3F805' :
         d < 300 ? '#74F805' :
                  '#74F805';
}

//this function returns a style object, but dynamically sets fillColor based on the data
function style(feature) {
  return {
    fillColor: getColor(feature.properties[redi_column]),
    weight: 1,
    opacity: 0.5,
    color: '',
    dashArray: '',
    fillOpacity: 1
  };
}

//this function is set to run when a user mouses over any polygon
function mouseoverFunction(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: 'blue',
      dashArray: '',
      fillOpacity: 1
  });

  if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
  }

  //update the text in the infowindow with whatever was in the data
  //console.log(layer.feature.properties.NTAName);
  $('#infoWindow').html(layer.feature.properties.NTAName+'<br />Hotspot Ranking: '+Math.round(layer.feature.properties[redi_column]));
}

//this runs on mouseout
function resetHighlight(e) {
	geojson.resetStyle(e.target);
}

//this is executed once for each feature in the data, and adds listeners
function onEachFeature(feature, layer) {
	layer.on({
	    mouseover: mouseoverFunction,
	    mouseout: resetHighlight
	    //click: zoomToFeature
	});
}

//Variable represents the desired column needed from dataset when appropriate button is clicked
var redi_column = 'RK_WPSI'; // initially shows equal weights REDI score

//Equal Weights REDI Score
$("#eqWeight").click(function(){
  redi_column = 'RK_Crash';
  geojson.setStyle(style);
  $('#infoWindow').html('Information Window<br />Updates as you hover over a tract');
});


//Social Infrastructure & Community Connectivity REDI Score
$("#socInf").click(function(){
  redi_column = 'RK_Cost';
  geojson.setStyle(style);
  $('#infoWindow').html('Information Window<br />Updates as you hover over a tract');
});

// Physical Infrastructure REDI Score
$("#phyInf").click(function(){
  redi_column = 'RK_WPSI';
  geojson.setStyle(style);
  $('#infoWindow').html('Information Window<br />Updates as you hover over a tract');
});

// Environmental Conditions REDI Score
$("#envCon").click(function(){
  redi_column = 'envredno_1';
  geojson.setStyle(style);
  $('#infoWindow').html('Information Window<br />Updates as you hover over a tract');
});

// Economic Strength REDI Score
$("#econStr").click(function(){
  redi_column = 'ecoredno_1';
  geojson.setStyle(style);
  $('#infoWindow').html('Information Window<br />Updates as you hover over a tract');
});

// adding a legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 15, 45, 90, 180],
        labels = [];

    // loop through redi score intervals and generate a label and colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : ' &ndash; 282');
    }

    return div;
};

legend.addTo(map1);