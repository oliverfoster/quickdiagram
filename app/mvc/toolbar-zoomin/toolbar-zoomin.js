define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-zoomin",
		className: "toolbar-zoomin toolbar-item",
		events: {
			"mousedown": "onMouseDown",
			"mouseup": "onMouseUp"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onMouseDown: function() {
			increaseFontSize(false);
			if (this.interval !== null) clearInterval(this.interval);
			this.interval = setInterval(function() {
				increaseFontSize(true);
			}, 100);
		},
		onMouseUp: function() {
			clearInterval(this.interval);
			this.interval = null;
		}
	});

	function increaseFontSize(big) {
		var Board = require("board");
		Board.setZoom(App.data.diagram[App.data.diagram.current].zoom * (big?1.1:1.01));
	}

	App.mvc.registerView(view);

	return view;

});