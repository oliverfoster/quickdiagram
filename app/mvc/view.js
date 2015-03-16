define(['backbone'], function() {


	var View = Backbone.View.extend({
		children: null,
		initialize: function(options) {
			this.children = [];
			this.children.ready = 0;
			
			_.extend(this, options);

			if (this.paused) return;

			this.start();
		},
		start: function() {
			if (!App.mvc.template[this.viewId]) {
				console.log("Template not defined", this.viewId);
				return;
			}
			this.model = App.mvc.model[this.viewId];
			this.template = App.mvc.template[this.viewId];
			
			this.postInitialize();
			this.setupEventListeners();

			_.defer(_.bind(this.render, this));
		},
		restoreSaved: function() {},
		setupEventListeners: function() {
			if (this.parent === undefined || this.parent.trigger === undefined) return;
			this.listenToOnce(this.parent, "remove", function() {
				if (!this.preRemove()) return;
				this.onRemove();
				this.remove();
			});
		},
		render: function() {
			this.preRender();
			if (this.template === undefined) {
				console.log("Template undefined");
			}
			this.$el.html(this.template(this.model));
			this.addChildren();
			_.defer(_.bind(this.postRender, this));
			_.defer(_.bind(this.restoreSaved, this));
		},
		addChildren: function() {
			if (this.model.children === undefined) return this.checkReady();
			this.children.length = 0;
			this.children.ready = 0;
			var children = this.model.children;
			var $container = this.$(".children");
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i];
				if (App.mvc.view[child] === undefined) {
					console.log("MVC child view not found: " + child);
					continue;
				}
				var childView = new App.mvc.view[child]({parent: this});
				this.children.push(childView);
				this.listenToOnce(childView, "ready", this.checkReady);
			}
			if (this.children.length === 0) this.checkReady();
		},
		checkReady: function() {
			if (this.children.length === 0) {
				this.trigger("ready");
				this.onReady();
				return;
			}
			if (this.children.ready >= this.children.length) return;
			this.children.ready++;
			if (this.children.length == this.children.ready) {
				this.trigger("ready");
				this.onReady();
			}
		},
		postInitialize: function(){},
		preRender: function(){},
		postRender: function(){
			this.trigger("ready");
		},
		onReady: function() {},
		onRemove: function(){}
	});

	return View;


});