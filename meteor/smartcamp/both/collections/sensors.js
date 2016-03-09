this.Sensors = new Mongo.Collection("sensors");

this.Sensors.userCanInsert = function(userId, doc) {
	return true;
}

this.Sensors.userCanUpdate = function(userId, doc) {
	return true;
}

this.Sensors.userCanRemove = function(userId, doc) {
	return true;
}
