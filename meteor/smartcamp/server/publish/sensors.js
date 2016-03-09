Meteor.publish("test", function() {
	return Sensors.find({}, {});
});

