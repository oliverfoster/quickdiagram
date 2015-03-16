define(function() {

	var App = _.extend({}, Backbone.Events);

	$.ajax({
		url: "app/app.json",
		type: "GET",
		dataType: "json",
		success: function(data) {
			App.data = data;
			require.config(data.require);
			var required = Object.keys(data.require.paths);
			require(required, function() {
				console.log("Loaded");
				App.trigger("loaded");
			});
		}
	});

	return App;

});