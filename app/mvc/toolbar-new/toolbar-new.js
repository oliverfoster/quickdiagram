define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-new",
		className: "toolbar-new toolbar-item",
		events: {
			"click": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onClick: function() {
			window.open(window.location.origin+window.location.pathname);
		}
	});


	App.mvc.registerView(view);

	return view;

});