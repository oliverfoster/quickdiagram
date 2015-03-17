define(['app/mvc/view'], function(View) {

	var toolbar = View.extend({
		viewId: "toolbar",
		className: "toolbar",
		onReady: function() {
			this.$el.velocity({opacity:1}, {duration: 500});
		}
	});

	App.mvc.registerView(toolbar);


	var instance = new toolbar({ paused: true });

	App.on("mvc:loaded", function(){

		instance.start();

		$('body').append(instance.$el);

	});

	return instance;

});