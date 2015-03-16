define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-mod",
		className: "toolbar-mod toolbar-item",
		events: {
			"click": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onClick: function(event) {
			event.preventDefault();
			event.stopPropagation();
			App.trigger("mod");
		}
	});

	App.mvc.registerView(view);

	return view;

});