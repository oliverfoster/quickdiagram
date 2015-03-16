define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-download",
		className: "toolbar-download toolbar-item",
		events: {
			"click": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		},
		onClick: function() {
			var file = encodeURI(JSON.stringify(App.data.diagram[App.data.diagram.current], null, "\t"));

			var data = "<!doctype html>\n<head>\n<script>\n";
			data += "var diagram = " + JSON.stringify(App.data.diagram[App.data.diagram.current], null, "\t") + ";\n\n";
			data += "var url = diagram.href+'?diagram='+encodeURI(JSON.stringify(diagram, null, \"\\t\"));\n";
			data += "window.location.href = url;\n";
			data += "</script>\n</head>\n<body>\n<script>\n";
			data += "\n";
			data += "</script>\n";
			data += "</body>\n</html>\n";


			data = encodeURI(data);
			var clicker = $('<a href="data:application/x-msdownload,'+data+'" download="untitled.html">')[0];
			var event = new MouseEvent('click', {
			    'view': window,
			    'bubbles': true,
			    'cancelable': true
			  });
			clicker.dispatchEvent(event);
		}
	});


	App.mvc.registerView(view);

	function utf8_to_b64( str ) {
		return window.btoa(unescape(encodeURIComponent( str )));
	}
	function b64_to_utf8( str ) {
		return decodeURIComponent(escape(window.atob( str )));
	}

	return view;

});

