define([
	'app/mvc/view', 
	'board', 
	'node'
], function(View, Board, Node) {

	var view = View.extend({
		viewId: "toolbar-remove",
		className: "toolbar-remove toolbar-item",
		events: {
			"mousedown": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onClick: function() {
			if (!App.selected || !App.selected.nodes || Object.keys(App.selected.nodes).length === 0) return;

			App.trigger("selected:remove")
		}
	});


	App.mvc.registerView(view);

	return view;

});