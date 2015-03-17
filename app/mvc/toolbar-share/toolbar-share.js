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
				window.location.hash="diagram=" +utf8_to_b64(JSON.stringify(App.data.diagram[App.data.diagram.current]));
			}, 500);
		},
		onClick: function() {
			var data = "<!doctype html>\n<head>\n<script>\n";
			data += "var diagram = \"" + utf8_to_b64(JSON.stringify(App.data.diagram[App.data.diagram.current])) + "\";\n\n";
			data += "var href = \"" + App.data.diagram[App.data.diagram.current].href + "\";\n";
			data += "var url = href+'#diagram='+diagram;\n";
			data += "window.location.href = url;\n";
			data += "</script>\n</head>\n<body>\n<script>\n";
			data += "\n";
			data += "</script>\n";
			data += "</body>\n</html>\n";


			data = encodeURI(data);

			window.prompt("Copy to clipboard: Ctrl+C, Enter", 'data:text/html,'+data);
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

