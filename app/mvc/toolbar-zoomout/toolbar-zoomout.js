define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-zoomout",
		className: "toolbar-zoomout toolbar-item",
		events: {
			"mousedown": "onMouseDown",
			"mouseup": "onMouseUp"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onMouseDown: function() {
			reduceFontSize(false);
			if (this.interval !== null) clearInterval(this.interval);
			this.interval = setInterval(function() {
				reduceFontSize(true);
			}, 100);
		},
		onMouseUp: function() {
			clearInterval(this.interval);
			this.interval = null;
		}
	});

	function reduceFontSize(big) {
		var Board = require("board");
		Board.setZoom(App.data.diagram[App.data.diagram.current].zoom / (big?1.1:1.01));
	}

	App.mvc.registerView(view);

	return view;

});