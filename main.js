$(function() {

  var polygons = []
    , defaultCountry = 'USA'
    , selectedPoly = null
  ;

  var mapOptions = {
    zoom: 1,
    center: new google.maps.LatLng(24.886, -70.268),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  google.maps.event.addListener(map, 'click', function() {
    deselect(selectedPoly);
  });

  // create the selector for country
  selectDiv = $('#countries');
  for (i in ids) {
    var html = '<option value="' + ids[i][1] + '">' + ids[i][0] + '</option>';
    selectDiv.append(html);
  }
  selectDiv.select2();

  // handle a new country being selected
  selectDiv.on('change', selectNewCountry);

  // and use that event handler to set the default country
  selectDiv.select2('val', defaultCountry, true);

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

    attachClickHandlers(registerPolygons(country));

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

  // add the polygons from the drawn country to the collection
  function registerPolygons(country) {
    // it's possible we get an array of arrays. This will flatten that if neeeded
    var merged = [];
    merged = merged.concat.apply(merged, country);
    polygons = polygons.concat(merged);
    return merged;
  }

  // when passed an array of polygons, attach click handlers to them
  function attachClickHandlers(polys) {
    // this is a job for map, really
    var handlers = []

    for (i in polys) {
      var polygon = polys[i];
      handlers.push(google.maps.event.addListener(polygon, 'click', function (event) {
        selectPoly(this);
      })); 
    }

    return handlers;
  }

  function selectPoly(polyObj) {
    if (selectedPoly) {
      deselect(selectedPoly);
    } 

    selectedPoly = polyObj;

    // make it green
    polyObj.setOptions({
      fillColor: '#00FF00',
      strokeColor: '#00FF00'
    });

    // get center
    setInterval(function() {
      rotate(polyObj, 10);
    }, 50);

    return polyObj;
  }

  function deselect(polyObj) {
    if (!polyObj) return;

    polyObj.setOptions({
      fillColor: '#FF0000',
      strokeColor: '#FF0000'
    });

    return polyObj;
  }

  function getCenter(polyObj) {
    var bounds = new google.maps.LatLngBounds();

    var proccessArray = function(array) {
      array.forEach(function(latLng, index) {
        bounds.extend(latLng);
      })
    }

    polyObj.getPaths().forEach(proccessArray);

    return bounds.getCenter();
  }

  function rotate(polyObj, angle) {
    var center = getCenter(polyObj);

    var proccessArray = function(array) {
      array.forEach(function(latLng, index) {
        var heading = google.maps.geometry.spherical.computeHeading(center, latLng);
        heading += 90;
        var newLL = google.maps.geometry.spherical.computeOffset(latLng, 400000, heading);
        array.setAt(index, newLL);
      })
    }

    polyObj.getPaths().forEach(proccessArray);

  }

});