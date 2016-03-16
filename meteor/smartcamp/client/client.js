this.App = {};
this.Helpers = {};

Meteor.startup(function() {
	
});

var Markers = new Meteor.Collection('markers');

//Meteor.subscribe('markers');

Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

  var map = L.map('map', {
    doubleClickZoom: true
  }).setView([45.1936093, 5.7739241], 13);

  L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

  var polytech = [[45.18489,5.75206],[45.18444,5.75213],[45.18401,5.75369],[45.18463,5.75396]];
  var polyline = L.polygon(polytech, {color: 'red'}).addTo(map);
  var carte1 = Sensors.find({id_card:"00000000691165ea"}).fetch();
  var capteur1 = Sensors.findOne("b827eb1165ea-0xf470ede4-3");
  var capteur2 = Sensors.findOne("b827eb1165ea-0xf470ede4-2");
  var capteur3 = Sensors.findOne("b827eb1165ea-0xf470ede4-4");
  //polyline.bindPopup("I am at polytech."+"<br/>"+obj.id.toString()+"<br/>"+obj.temperature.value.toString()+" "+obj.temperature.unit.toString());

  polyline.bindPopup($('<a href="#" class="speciallink">Information</a>').click(function() {
    alert("I am at polytech.\n Sensor 1 :"+capteur1.id.toString()+"\n"+capteur1.Temperature.value.toString()+" "+capteur1.Temperature.units.toString());
    alert("I am at polytech.\n Sensor 2 :"+capteur2.id.toString()+"\n"+capteur2.Temperature.value.toString()+" "+capteur2.Temperature.units.toString());
    alert("I am at polytech.\n Sensor 3 :"+capteur3.id.toString()+"\n"+capteur3.Temperature.value.toString()+" "+capteur3.Temperature.units.toString());
    alert("I am at polytech.\n Sensor test :");
})[0]);
///////////////////////////////salle2 //////////////////////////////////////////////////////////////////////////
  var temp_salle2 = 0;
  var humid_salle2 = 0;
  var temp_ext2 = 0;
  var i = 0;
  var z = 0;
  var presence2 = "empty"
  var carte2 = Sensors.find({id_card:"000000002317b46e"}).fetch();

  carte2.forEach(function(y){
	if(typeof y.Temperature != 'undefined'){
		temp_salle2 = parseInt(temp_salle2 +  parseInt(y.Temperature.value));
                i = i+1;
		}
	});

  carte2.forEach(function(y){
	if((typeof y.temperature != 'undefined') && y._id != 'UV2/0x0C00' && y._id != 'TH2/0xF401'){
		temp_salle2 = parseInt(temp_salle2 + parseInt(y.temperature.value));
                i = i+1;
		}
	});

  carte2.forEach(function(y){
	if(typeof y.humidity != 'undefined' && y._id != 'TH2/0xF401'){
		humid_salle2 = (humid_salle2 + y.humidity.value);
                z = z+1;
		}
	});

    carte2.forEach(function(y){
	if(typeof y.motion != 'undefined'){
		if (y.motion.value != 0){presence2 = "not empty"};
		}
	});
  humid_salle2 = humid_salle2/z;
  temp_salle2 = Math.round(temp_salle2*10/i)/10;
  var sensor_out = Sensors.findOne('TH2/0xF401');

  var fablab = [[45.19397,5.77057],[45.19401,5.77125],[45.19392,5.77126],[45.19388,5.77059]];
  var polyline2 = L.polygon(fablab, {color: 'blue'}).addTo(map);
	polyline2.bindPopup($('<a href="#" class="speciallink">Information</a>').click(function() {

	    alert("I am at SmartClasroom.\nTemperature inside (mean) : "+temp_salle2+"°C\nTemperature outside : "+sensor_out.temperature.value+"°C\nHumidity inside : "+humid_salle2+"%\nHumidity ouside : "+sensor_out.humidity.value+"%\nRoom : "+presence2)

	})[0]);

///////////////////////////////salle2 //////////////////////////////////////////////////////////////////////////

};

this.menuItemClass = function(routeName) {
	if(!Router.current() || !Router.current().route) {
		return "";
	}

	if(!Router.routes[routeName]) {
		return "";
	}

	var currentPath = Router.routes[Router.current().route.getName()].handler.path;
	var routePath = Router.routes[routeName].handler.path;

	if(routePath === "/") {
		return (currentPath == routePath || Router.current().route.getName().indexOf(routeName + ".") == 0) ? "active" : "";
	}

	return currentPath.indexOf(routePath) === 0 ? "active" : "";
};

Helpers.menuItemClass = function(routeName) {
	return menuItemClass(routeName);
};

Helpers.randomString = function(strLen) {
	return Random.id(strLen);
};

Helpers.secondsToTime = function(seconds, timeFormat) {
	return secondsToTime(seconds, timeFormat);
};

Helpers.integerDayOfWeekToString = function(day) {
	if(_.isArray(day)) {
		var s = "";
		_.each(day, function(d, i) {
			if(i > 0) {
				s = s + ", ";
			}
			s = s + ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d];
		});
		return s;
	}
	return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
};

Helpers.formatDate = function(date, dateFormat) {
	if(!date) {
		return "";
	}

	var f = dateFormat || "MM/DD/YYYY";

	if(_.isString(date)) {
		if(date.toUpperCase() == "NOW") {
			date = new Date();
		}
		if(date.toUpperCase() == "TODAY") {
			var d = new Date();
			date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
		}
	}

	return moment(date).format(f);
};

Helpers.booleanToYesNo = function(b) {
	return b ? "Yes" : "No";
};

Helpers.integerToYesNo = function(i) {
	return i ? "Yes" : "No";
};

Helpers.integerToTrueFalse = function(i) {
	return i ? "True" : "False";
};

// Tries to convert argument to array
//   array is returned unchanged
//   string "a,b,c" or "a, b, c" will be returned as ["a", "b", "c"]
//   for other types, array with one element (argument) is returned
//   TODO: implement other types to array conversion
Helpers.getArray = function(a) {
	a = a || [];
	if(_.isArray(a)) return a;
	if(_.isString(a)) {
		var array = a.split(",") || [];
		_.each(array, function(item, i) { array[i] = item.trim(); });
		return array;
	}
	if(_.isObject(a)) {
		// what to return? keys or values?
	}

	var array = [];
	array.push(a);
	return array;
};

Helpers.cursorEmpty = function(cursor) {
	return cursor && cursor.count();
};

_.each(Helpers, function (helper, key) {
	Handlebars.registerHelper(key, helper)
});
