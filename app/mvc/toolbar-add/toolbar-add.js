define([
	'app/mvc/view', 
	'board', 
	'node'
], function(View, Board, Node) {

	Board.nodes = [];

	var view = View.extend({
		viewId: "toolbar-add",
		className: "toolbar-add toolbar-item",
		events: {
			"click": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onClick: function() {
			var node = new Node();
			Board.addNode(node);
		}
	});


	App.mvc.registerView(view);

	return view;

});