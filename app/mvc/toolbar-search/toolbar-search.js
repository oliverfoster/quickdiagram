define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-search",
		className: "toolbar-search toolbar-item",
		events: {
			"click": "onToggle",
			"click .search-text-input": "onClick"
		},
		postRender: function() {
			this.closed = true;
			this.parent.$(".right").append(this.$el);
			this.trigger("ready");
		},
		onClick: function(event) {
			event.preventDefault();
			event.stopPropagation();
		},
		onToggle: function() {
			if (!this.closed) {
				this.$el.velocity({width:"42px"}, {duration:250, easing: "easeOutSine"});
				this.$el.css({
					"border-radius": "",
					"padding-right": ""				
				});
				this.closed = true;
			} else {
				this.$el.velocity({width:"285px"}, {duration:250, easing: "easeOutSine"});
				this.$el.css({
					"border-radius": "4px 0px 0px 23px",
					"padding-right": "10px"
				});
				this.closed = false;
			}
		}
	});


	App.mvc.registerView(view);

	return view;

});