define(['app/mvc/view'], function(View) {

	var sidebar = View.extend({
		viewId: "sidebar",
		className: "sidebar",
		closed: true,
		events: {
			"click .close": "onToggle",
			"mousedown .sidebar-item": "onAction"
		},
		onReady: function() {
			this.$el.velocity({opacity:1}, {duration: 500});
		},
		onToggle: function() {
			if (!this.closed) {
				this.$(".sidebar-icon").removeClass("fa-chevron-left").addClass("fa-chevron-right");
				this.$el.velocity({width:"0px"}, {duration:250, easing: "easeOutSine"});
				$(".scrollZone").velocity({right:"0px"}, {duration:250, easing: "easeOutSine"});
				this.closed = true;
			} else {
				this.$(".sidebar-icon").removeClass("fa-chevron-right").addClass("fa-chevron-left");
				this.$el.velocity({width:"48px"}, {duration:250, easing: "easeOutSine"});
				$(".scrollZone").velocity({right:"48px"}, {duration:250, easing: "easeOutSine"});
				this.closed = false;
			}
		},
		onAction: function (event) {
			var action = $(event.currentTarget).attr("data-action");
			if (!action) return;
			App.trigger("styleChange", action);
		}
	});

	App.mvc.registerView(sidebar);


	var instance = new sidebar({ paused: true });

	App.on("mvc:loaded", function(){

		instance.start();

		$('body').append(instance.$el);

	});

	return instance;

});