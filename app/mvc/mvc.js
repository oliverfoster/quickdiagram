define(['app/mvc/view'],function() {

	var path = "app/mvc/";

	App.on("loaded", function() {
		initialize();
		console.log("MVC Loading...");
		mvc(App.data.mvc, loaded);
	});

	var initialize = function() {
		App.mvc = {
			view: {},
			model: {},
			template: {},
			registerView: function(view) {
				App.mvc.view[view.prototype.viewId] = view;
			}
		};
	};

	var loaded = function(loadedModules) {
		console.log("MVC Loaded : " + Object.keys(loadedModules).join(","));
		if (!loadChildren()) {
			console.log("Finished Loading");
			_.delay(function() {

				App.trigger("mvc:loaded");
			}, 10);
		}
	};

	var loadChildren = function() {
		var hasLoaded = true;
		var childrenToLoad = [];
		for (var k in App.mvc.model) {
			var model = App.mvc.model[k];
			if (model === undefined) continue;
			var children = model.children;
			if (children === undefined) continue;
			childrenToLoad = childrenToLoad.concat(children);
		}
		hasLoaded = mvc(childrenToLoad, loaded);
		if (hasLoaded) {
			console.log("MVC Loading Children...");
			return true;
		}
		return false;
	};

	var mvc = function(load, callback) {

		var interfaces = load;
		var count = interfaces.length;
		var loading = 0;

		var required = {};
		for (var i = 0, l = count; i < l; i++) {
			var interface = interfaces[i];
			if (App.mvc.template[interface]) continue;

			loading++;
			required[interface] = path+interface+"/"+interface;

			$.ajax({
				url: path+interface+"/"+interface+".css?bust=" +  (new Date()).getTime(),
				type: "GET",
				dataType: "text",
				success: _.partial(cssLoaded, interface)
			});

			$.ajax({
				url: path+interface+"/"+interface+".hbs?bust=" +  (new Date()).getTime(),
				type: "GET",
				dataType: "text",
				success: _.partial(templateLoaded, interface)
			});

			$.ajax({
				url: path+interface+"/"+interface+".json?bust=" +  (new Date()).getTime(),
				type: "GET",
				dataType: "json",
				success: _.partial(modelLoaded, interface)
			});
		}

		if (loading === 0) return false;

		var loadedStyles = 0;
		var $head = $('head');
		function cssLoaded(name, data) {
			loadedStyles++;
			var $style = $('<style data-id="'+name+'">');
			$style.html(data);
			$head.append($style);
			checkReady();
		}

		var loadedTemplates = 0;
		function templateLoaded(name, data) {
			loadedTemplates++;
			App.mvc.template[name] = Handlebars.compile(data);
			Handlebars.registerPartial(name, App.mvc.template[name]);
			checkReady();
		}

		var loadedModels = 0;
		function modelLoaded(name, data) {
			loadedModels++;
			App.mvc.model[name] = data;
			checkReady();
		}

		require.config({paths:required});
		require(Object.keys(required), viewsLoaded);

		var loaded = false;
		var loadedViews = false;
		function checkReady() {
			if (loadedStyles == loading && loadedTemplates == loading && loadedModels == loading && loadedViews && !loaded) {
				console.log("Loading:",loading);
				loaded = true;
				callback(required);
			}
		}

		function viewsLoaded() {
			loadedViews = true;
			checkReady();
		}

		return true;
	};

	return mvc;

});