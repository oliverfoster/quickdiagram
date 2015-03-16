define(['app/mvc/view'], function(View) {

	var view = View.extend({
		viewId: "toolbar-upload",
		className: "toolbar-upload toolbar-item",
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
		}
	});


	App.mvc.registerView(view);

	return view;

});