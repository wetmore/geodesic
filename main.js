$(function() {

  var mapOptions = {
    zoom: 1,
    center: new google.maps.LatLng(24.886, -70.268),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // create the selector for country
  selectDiv = $('#countries');
  for (i in ids) {
    selectDiv.append('<option value="' + ids[i][1] + '">' + ids[i][0] + '</option>');
  }
  selectDiv.select2();

  // handle a new country being selected
  selectDiv.on('change', selectNewCountry);

  retrieveCountryThen('USA', function(json) {
    drawCountry(json);
  });

  function selectNewCountry(e) {
    retrieveCountryThen(this.value, function(json) {
      drawCountry(json);
    });

  }

  function drawCountry(json) {

    var country = new GeoJSON(json, {
      map: map,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      geodesic: true
    });

  }

  // call the given callback, supplying it with JSON of the given country
  function retrieveCountryThen(country, cb) {  
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/world.geo.json/countries/' + country + '.geo.json', true);
    xhr.onload = function() {
      cb(JSON.parse(this.responseText));
    };
    xhr.send();
  }

});