var pageSession = new ReactiveDict();

Template.Home.rendered = function() {
	
};

Template.Home.events({
	
});

Template.Home.helpers({
	
});

var HomeViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("HomeViewSearchString");
	var sortBy = pageSession.get("HomeViewSortBy");
	var sortAscending = pageSession.get("HomeViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["topic", "message", "modifiedAt"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var HomeViewExport = function(cursor, fileType) {
	var data = HomeViewItems(cursor);
	var exportFields = ["topic", "message", "modifiedAt"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.HomeView.rendered = function() {
	pageSession.set("HomeViewStyle", "table");
	
};

Template.HomeView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("HomeViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("HomeViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("HomeViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		HomeViewExport(this.test, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		HomeViewExport(this.test, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		HomeViewExport(this.test, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		HomeViewExport(this.test, "json");
	}

	
});

Template.HomeView.helpers({

	

	"isEmpty": function() {
		return !this.test || this.test.count() == 0;
	},
	"isNotEmpty": function() {
		return this.test && this.test.count() > 0;
	},
	"isNotFound": function() {
		return this.test && pageSession.get("HomeViewSearchString") && HomeViewItems(this.test).length == 0;
	},
	"searchString": function() {
		return pageSession.get("HomeViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("HomeViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("HomeViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("HomeViewStyle") == "gallery";
	}

	
});


Template.HomeViewTable.rendered = function() {
	
};

Template.HomeViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("HomeViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("HomeViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("HomeViewSortAscending") || false;
			pageSession.set("HomeViewSortAscending", !sortAscending);
		} else {
			pageSession.set("HomeViewSortAscending", true);
		}
	}
});

Template.HomeViewTable.helpers({
	"tableItems": function() {
		return HomeViewItems(this.test);
	}
});


Template.HomeViewTableItems.rendered = function() {
	
};

Template.HomeViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Sensors.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Sensors.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	}
});

Template.HomeViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});
