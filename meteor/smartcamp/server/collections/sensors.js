Sensors.allow({
	insert: function (userId, doc) {
		return Sensors.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Sensors.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Sensors.userCanRemove(userId, doc);
	}
});

Sensors.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Sensors.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Sensors.before.remove(function(userId, doc) {
	
});

Sensors.after.insert(function(userId, doc) {
	
});

Sensors.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Sensors.after.remove(function(userId, doc) {
	
});
