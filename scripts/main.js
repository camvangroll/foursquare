var activity = {};

// for ajax
activity.url = "https://api.foursquare.com/v2/venues/explore";
activity.client = "LXPSZXFCGFE1VMU33P4CYHFZXNLZDA3GIPM05SJI2AS1W20H";
activity.secret = "PDZOVDI2YNL1IJ1NLSPZ0MJ3VXFTHY2DDF0LMWN2HC01FENV";
activity.version = "2013081520";
activity.access = "pk.eyJ1IjoiY2FyeXMiLCJhIjoiY2lmcnA0bDAxMG1yNHMybTB4cDFkMnEzMyJ9.4Z26iDuKWwLy8qs1MyTkDg";

activity.markerLayer = L.layerGroup(); //the layers for the map go in the group so they can be removed

//initial ajax call
activity.getChoice = function(userChoice) {
  $.ajax({
    url: activity.url,
    method: 'GET',
    dataType: 'jsonp',
    data : {
    	client_id: activity.client,
    	client_secret: activity.secret,
    	near: "toronto",
    	query: userChoice,
    	v: activity.version, 
      limit: 3,
    }
  }).then(function(res) {
      activity.displayResults(res.response.groups[0].items);
  });
};


// display the activities
activity.displayResults = function(venues){
  activity.markerLayer.clearLayers();
  $.each(venues, function(i, value) {
    //to display in results div
    var name = $("<h2>").text(" " + value.venue.name);
    var location = $("<h3>").addClass("arrow").text(" " + (value.venue.location.address ? value.venue.location.address : 'Address not available')); 
    var rating = $("<h3>").addClass("star").text(" Rating: " + (value.venue.rating ? value.venue.rating : '0') + "/10, based on " + (value.venue.ratingSignals ? value.venue.ratingSignals : '0') + " votes." );
    var checkIns = $("<h3>").addClass("check").text(" All time FourSquare check-ins: " + value.venue.stats.checkinsCount);
    var checkedIn = $("<h3>").addClass("user").text(" Check-ins now: " + value.venue.hereNow.summary);
    var site = $("<h3>").addClass("site").html("Visit " + "<a href='" + value.venue.url + "'>website</a>" + " for more info");
    var container = $("<div>").append(name, location, rating, checkIns, checkedIn, site);
    $("#text").append(container);
    
    //to display on map
    L.marker([value.venue.location.lat,value.venue.location.lng]).bindPopup
    ("<h4>"+ value.venue.name+"</h4>" +
    "<a href = '"+ value.venue.url+"'>Visit website</a>" +
    "<h4>"+ value.venue.location.address+"</h4>")
    .addTo(activity.markerLayer);
  });
  activity.markerLayer.addTo(activity.map);
};

//get the map
activity.getMap = function() {
  L.mapbox.accessToken = activity.access;
  activity.map = L.mapbox.map('map', 'carys.npajk2lb')
      .setView([43.677, -79.436], 11);
};

// everything to run on doc ready
activity.init = function() {
	activity.getChoice("bowling"),
  $("#activity").on("change", function(e) {
      e.preventDefault();
      var quirky = $(this).val();
      $("#text").empty();
      activity.getChoice(quirky);
      $('main').show(); //this needs to be here specifically
      activity.getMap(); //this needs to be here specifically too
      $('html,body').animate({scrollTop:$("#venues").offset().top}, 'slow');

      if (container == 1) {
        $('.second,.third').hide();
      }
      if (container == 2) {
        $('.third').hide();
      }
  });
};

//document ready
$(function() {
	activity.init();
});
