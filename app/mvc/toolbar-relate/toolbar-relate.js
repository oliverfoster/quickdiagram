define([
	'app/mvc/view',
	'board'
	], function(View, Board) {
	var svgNS = "http://www.w3.org/2000/svg"; 

	var view = View.extend({
		viewId: "toolbar-relate",
		className: "toolbar-relate toolbar-item",
		events: {
			"mousedown": "onClick"
		},
		postRender: function() {
			this.parent.$(".left").append(this.$el);
			this.trigger("ready");
			this.listenTo(App, "nodes:move nodes:resize nodes:remove", this.onResize);
		},
		onClick: function() {
			
			if (!App.selected || !App.selected.nodes || Object.keys(App.selected.nodes).length < 2) return;
			if (!App.initial) return;


			if (!App.data.diagram[App.data.diagram.current].relations)
				App.data.diagram[App.data.diagram.current].relations = {};

			var initial = App.data.diagram[App.data.diagram.current].nodes[App.initial];

			for (var k in App.selected.nodes) {
				if (k == App.initial) continue;
				var node = App.data.diagram[App.data.diagram.current].nodes[k];

				if (App.data.diagram[App.data.diagram.current].relations &&
					App.data.diagram[App.data.diagram.current].relations[initial.uid] &&
					App.data.diagram[App.data.diagram.current].relations[initial.uid][node.uid]) {
					delete App.data.diagram[App.data.diagram.current].relations[initial.uid][node.uid];
					App.trigger("relation:remove");
					continue;
				}

				if (App.data.diagram[App.data.diagram.current].relations &&
					App.data.diagram[App.data.diagram.current].relations[node.uid] &&
					App.data.diagram[App.data.diagram.current].relations[node.uid][initial.uid]) {
					delete App.data.diagram[App.data.diagram.current].relations[node.uid][initial.uid];
					App.trigger("relation:remove");
					continue;
				}

				var relation = $(document.createElementNS(svgNS,"path"));
				relation.attr({
					"class": "relation",
					"data-parent-id": initial.uid,
					"data-child-id": node.uid
				});

				var startSpot = {
					x: initial.x + (initial.width / 2),
					y: initial.y + (initial.height / 2)
				};

				var endSpot = {
					x: node.x + (node.width / 2),
					y: node.y + (node.height / 2)
				};

				relation.attr({
					"d": "M"+startSpot.x+" " +startSpot.y+" L "+endSpot.x+" "+endSpot.y+""
				});

				Board.$el.find(".nodes .scaler.relation-board").append(relation);

				if (!App.data.diagram[App.data.diagram.current].relations[initial.uid])
					App.data.diagram[App.data.diagram.current].relations[initial.uid] = {};
				App.data.diagram[App.data.diagram.current].relations[initial.uid][node.uid]=true;

				App.trigger("relation:add");
			}

			App.altDown = true;
			setTimeout(function() {
				App.altDown = false;
			}, 500);

			this.onResize();
		},
		onResize: function() {
			var relations = Board.$el.find(".nodes .scaler.relation-board .relation");

			for (var i = 0, l = relations.length; i < l; i++ ){
				var relation = $(relations[i]);
				var parentId = relation.attr("data-parent-id");
				var childId = relation.attr("data-child-id");

				var initial = App.data.diagram[App.data.diagram.current].nodes[parentId];
				var node = App.data.diagram[App.data.diagram.current].nodes[childId];

				if (initial === undefined || node === undefined) {
					relation.remove();
					continue;
				}

				if ((!App.data.diagram[App.data.diagram.current].relations ||
					!App.data.diagram[App.data.diagram.current].relations[initial.uid] ||
					!App.data.diagram[App.data.diagram.current].relations[initial.uid][node.uid]) &&
					(!App.data.diagram[App.data.diagram.current].relations ||
					!App.data.diagram[App.data.diagram.current].relations[node.uid] ||
					!App.data.diagram[App.data.diagram.current].relations[node.uid][initial.uid])) {
					relation.remove();
					continue;
				}

				var startSpot = {
					x: initial.x + (initial.width / 2),
					y: initial.y + (initial.height / 2)
				};

				var endSpot = {
					x: node.x + (node.width / 2),
					y: node.y + (node.height / 2)
				};

				relation.attr({
					"d": "M"+startSpot.x+" " +startSpot.y+" L "+endSpot.x+" "+endSpot.y+""
				});
				
			}
		}
	});


	App.mvc.registerView(view);

	return view;

});