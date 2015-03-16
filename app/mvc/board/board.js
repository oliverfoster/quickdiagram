define(['app/mvc/view', 'draggabilly'], function(View, Draggabilly) {
	var svgNS = "http://www.w3.org/2000/svg"; 

	var board = View.extend({
		viewId: "board",
		className: "board",
		nodes: null,
		$svg: null,
		events: {
			"click": "onClick"
		},
		postInitialize: function() {
			this.nodes = [];
			this.svgAttributes = {
				translator: {},
				scaler: {}
			};
		},
		postRender: function() {
			var $scrollZone = this.$(".scrollZone");
			var $spacer = this.$(".spacer");
			var $board = this.$el;
			var $sidebar = $(".sidebar");

			this.$svg = $spacer;

			$spacer.attr(this.model.svg);

			var viewPortWidth = $board.width()-$sidebar.width();
			var viewPortHeight = $board.height();
			var left = ($spacer.width() / 2) - (viewPortWidth/2);
			var top = ($spacer.height() / 2) - (viewPortHeight/2);

			$scrollZone.scrollTo({left:left + "px", top:top + "px"});
			$scrollZone.scroll(_.bind(this.onScroll, this));

			restore();
		},
		onScroll: function(event) {
			var scrollZone = this.$(".scrollZone");
			scrollZone.css({
				"zIndex": "2"
			});
			this.throttle("scroll", function() {
				scrollZone.css({
					"zIndex": ""
				});
			}, 500);
		},
		setZoom: function(percent) {
			var $spacer = this.$(".spacer");
			var height = $spacer.height();
			var width = $spacer.width();

			App.data.diagram[App.data.diagram.current].zoom = percent;
			var ratio = percent / 100;

			this.svgAttributes.scaler.transform = this.svgAttributes.scaler.transform || {};
			this.svgAttributes.scaler.transform.scale = this.svgAttributes.scaler.transform.scale || [];
			this.svgAttributes.translator.transform = this.svgAttributes.translator.transform || {};
			this.svgAttributes.translator.transform.translate = this.svgAttributes.translator.transform.translate || [];

			

			this.svgAttributes.scaler.transform.scale[0] = ratio;
			this.svgAttributes.scaler.transform.scale[1] = ratio;
			this.svgAttributes.translator.transform.translate[0] = (width / 2) - ((width / 2) * ratio);
			this.svgAttributes.translator.transform.translate[1] = (height / 2) - ((height / 2) * ratio);


			this.$el.find(".nodes .scaler, .relations .scaler").attr(this.getSVGAttributes('scaler'));
			this.$el.find(".nodes .translator, .relations .translator").attr(this.getSVGAttributes('translator'));
		},
		getSVGAttributes: function(name) {
			var ret = {};
			for (var k in this.svgAttributes[name]) {
				ret[k] = "";
				if (typeof this.svgAttributes[name][k] == "object") {
					for (var sk in this.svgAttributes[name][k]) {
						if (this.svgAttributes[name][k][sk].length === 0) continue;
						ret[k] += sk + "(" + this.svgAttributes[name][k][sk].join(",") + ") ";
					}
				}
			}
			return ret;
		},
		addNode: function(node) {
			var $scrollZone = this.$(".scrollZone");
			var $spacer = this.$(".spacer");
			var $board = this.$el;
			var $sidebar = $(".sidebar");
			

			var viewPortWidth = $board.width()-$sidebar.width();
			var viewPortHeight = $board.height();

			//SORT OUT START POINT AT ZOOM
			var offsetLeft = ($spacer.width() / 2);
			var offsetTop = ($spacer.height() / 2)
			var top = $scrollZone.scrollTop()+($board.height()/2);
			var left = $scrollZone.scrollLeft()+(($board.width() - $sidebar.width())/2);

			node.setPosition({
				y: top,
				x: left
			});

			this.nodes.push(node);
			this.$el.find(".nodes .scaler.node-board").append(node.$el);
		},
		onRemove: function() {

		},
		onReady: function() {
			this.$el.velocity({opacity:1}, {duration: 2000});
		},
		onClick: function() {
			App.doubleClicked = false;
			App.trigger("altMod", false);
			$(".altmod").css({"display":"none"});
			App.trigger("nodes:blur");
		}
	});

	throttle.extend(board.prototype);

	App.mvc.registerView(board);

	var instance = new board({ paused: true });

	App.on("mvc:loaded", function(){

		instance.start();

		$('body').append(instance.$el);

		_.extend(App.data.diagram[App.data.diagram.current], {
			zoom: 100,
			href: window.location.href
		});

		var orig = App.data.diagram;
		var ret = [];
		for (var i = 0, l = App.data.diagram.length; i < l; i++) {
			ret.push(App.data.diagram[i]);
		}
		App.data.diagram = ret;
		App.data.diagram.current = orig.current;

	});


	var restore = function() {
		if (!url('#diagram')) return;
		var diagram = App.data.diagram[App.data.diagram.current] = JSON.parse(decodeURI(url('#diagram')));
		console.log(App.data.diagram[App.data.diagram.current]);
		
		var Node = require("node");

		instance.setZoom(diagram.zoom);
		document.title = diagram.title;

		for (var k in App.data.diagram[App.data.diagram.current].relations) {
			var children = Object.keys(App.data.diagram[App.data.diagram.current].relations[k]);
			if (children.length === 0) continue;

			var initial = App.data.diagram[App.data.diagram.current].nodes[k];

			for (var i = 0, l = children.length; i < l; i++) {
				var node = App.data.diagram[App.data.diagram.current].nodes[children[i]];

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

				instance.$el.find(".nodes .scaler.relation-board").append(relation);
			}
		}

		for (var k in diagram.nodes) {
			var node = new Node({saved:diagram.nodes[k]});
			instance.addNode( node );
		}

	}

	var $win = $(window);
	$win.resize(windowResize);
	function windowResize() {
		if ($win.width() < 600) {
			$('html').removeClass('large').addClass("small");
		} else {
			$('html').removeClass('small').addClass("large");
		}
	}
	windowResize();
	return instance;

});
