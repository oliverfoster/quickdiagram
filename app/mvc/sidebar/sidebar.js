define(['app/mvc/view'], function(View) {

	var sidebar = View.extend({
		viewId: "sidebar",
		className: "sidebar",
		closed: true,
		events: {
			"click .close": "onToggle"
		},
		onReady: function() {
			this.$el.velocity({opacity:1}, {duration: 2000});
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