define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-share",
		className: "toolbar-share toolbar-item",
		events: {
			"click": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");

			this.listenTo(App, "styleChanged", this.onDiagramChange);
			this.listenTo(App, "node:add", this.onDiagramChange);
			this.listenTo(App, "selected:remove", this.onDiagramChange);
			this.listenTo(App, "relation:add", this.onDiagramChange);
			this.listenTo(App, "relation:remove", this.onDiagramChange);
		},
		onDiagramChange: function() {
			this.throttle("saving", function() {
				console.log("Saving");
				window.location.hash="diagram=" +encodeURI(utf8_to_b64(JSON.stringify(App.data.diagram[App.data.diagram.current])));
			}, 500);
		},
		onClick: function() {
			window.alert("Please copy and paste url");
		}
	});

	throttle.extend(view.prototype);

	App.mvc.registerView(view);

	function utf8_to_b64( str ) {
		return window.btoa(unescape(encodeURIComponent( str )));
	}
	function b64_to_utf8( str ) {
		return decodeURIComponent(escape(window.atob( str )));
	}

	return view;

});

