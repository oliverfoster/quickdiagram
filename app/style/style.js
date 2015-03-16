define(function() {

	App.on("loaded", function() {
		console.log("Style Loading...");

		var styles = App.data.style;
		var count = styles.length;

		for (var i = 0, l = count; i < l; i++) {
			var style = styles[i];

			$.ajax({
				url: "app/style/"+style+".css",
				dataType: "text",
				type: "GET",
				success: _.partial(cssLoaded, style)
			});

		}

		var loadedStyles = 0;
		var $head = $('head');
		function cssLoaded(name, data) {
			loadedStyles++;
			var $style = $('<style id="'+name+'">');
			$style.html(data);
			$head.append($style);
			checkReady();
		}

		var loaded = false;
		function checkReady() {
			if (loadedStyles == count && !loaded) {
				loaded = true;
				console.log("Style Loaded : " + styles.join(","));
				App.trigger("style:loaded");
			}
		}

	});

});