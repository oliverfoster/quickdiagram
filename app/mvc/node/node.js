define(['app/mvc/view', 'draggabilly'], function(View, Draggabilly) {
	var svgNS = "http://www.w3.org/2000/svg"; 

	App.data.diagram[App.data.diagram.current].nodes = {};

	var uid = 0;
	var node = View.extend({
		tagName: "rect",
		viewId: "node",
		className: "node",
		focused: false,
		events: {
			"click": "onFocus",
			"mouseover": "onMouseOver",
			"focus": "onFocus",
			"blur": "onBlur",
			"click .header": "setDocumentTitle"
		},
		setDocumentTitle: function() {
			document.title = "Diagram - " + this.$(".textarea").val();
			App.data.diagram[App.data.diagram.current].title = document.title;
		},
		el: function() {
			var ele = document.createElementNS(svgNS,"g");
			return ele;
		},
		postInitialize: function() {
			this.uid = ++uid;
			this.item = {
				uid: uid,
				text: ""
			};

			this.$el.attr("data-uid", uid);
			this.$el.attr(this.model.node);
			
			this.svgAttributes = {
				transform: {
					translate: [0,0]
				},
				class: this.className
			};
			App.data.diagram[App.data.diagram.current].nodes[uid] = this.item;
			this.$el.attr(this.getSVGAttributes());

		},
		postRender: function() {
			this.setText(this.item.text, true);
			this.setSize({
				width: 106,
				height: 48
			});


			var mover = new Draggabilly( this.$el[0], {
				cssEnabled: false,
				handle: ".mover"
			});
			this.mover = mover;
			mover.on('dragStart', _.bind(this.onDragStart, this));
			mover.on('dragMove', _.bind(this.onDragMove, this));
			mover.disable();

			var resizer = new Draggabilly( this.$el.find(".resize")[0], {
				cssEnabled: false
			});
			this.resizer = resizer;
			resizer.on('dragStart', _.bind(this.onDragResizeStart, this));
			resizer.on('dragMove', _.bind(this.onDragResizeMove, this));

			var $scrollZone = $(".scrollZone");
			$scrollZone.scroll(_.bind(this.onScroll, this));

			this.$el.on("keyup", _.bind(function(event) {
				this.setText(this.$(".textarea").val(), false);
			}, this));

			this.$(".textarea").on("blur", _.bind(this.onBlur,this));

			this.listenTo(App, "nodes:blur", this.onUnSelect);
			this.listenTo(App, "altMod", this.onAltMod);
			this.listenTo(App, "styleChange", this.onStyleChange);
			this.listenTo(App, "selected:remove", this.onSelectedRemove);

		},
		onStyleChange: function(char) {
			if (!App.selected || !App.selected.nodes) return;
			if (!Object.keys(App.selected.nodes).length === 0) return;
			if (!App.selected.nodes[this.uid]) return

			if (!this.item.css) this.item.css = {};
			switch (char) {
			case 187: //+
				var value = parseInt(this.$(".textarea").css("font-size"));
				value = value * 1.1;
				this.$(".textarea").css({
					"font-size": value
				});
				this.item.css['font-size'] = value;
				break;
			case 189: //-
				var value = parseInt(this.$(".textarea").css("font-size"));
				value = value / 1.1;
				this.$(".textarea").css({
					"font-size": value
				});
				this.item.css['font-size'] = value;
				break;
			case 73: //i
				var value = this.$(".textarea").css("font-style");
				value = value =="italic" ? "": "italic";
				this.$(".textarea").css({
					"font-style": value
				});
				this.item.css['font-style'] = value;
				break;
			case 66: //b
				var value = this.$(".textarea").css("font-weight");
				value = value == "bold" ? "": "bold"
				this.$(".textarea").css({
					"font-weight": value
				});
				this.item.css['font-weight'] = value;
				break;
			case 85: //u
				var value = this.$(".textarea").css("text-decoration");
				value = value =="underline" ? "": "underline"
				this.$(".textarea").css({
					"text-decoration": value
				});
				this.item.css['text-decoration'] = value;
				break;
			case 83: //s
				var value = this.$(".textarea").css("text-decoration");
				value = value =="line-through" ? "": "line-through";
				this.$(".textarea").css({
					"text-decoration": value
				});
				this.item.css['text-decoration'] = value;
				break;
			}
		},
		onAltMod: function(on) {
			if (on) {
				this.mover.enable();
			} else {
				this.mover.disable();
			}
		},
		onMouseOver: function() {
			if (App.altDown === true) {
				this.onFocus()
			}
		},
		onFocus: function(event) {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			var scrollZone = $(".scrollZone")[0];
			this.focused = true;
			this.scrollTop = scrollZone.scrollTop;
			this.scrollLeft = scrollZone.scrollLeft;
			this.onSelect();
		},
		onBlur: function() {
			this.focused = false;

			if (!App.selected || !App.selected.nodes || Object.keys(App.selected.nodes).length > 1) return;

			this.onUnSelect();
		},
		onScroll: function() {
			var $scrollZone = $(".scrollZone");
			if (this.focused) {
				$scrollZone.scrollTo({top:this.scrollTop, left:this.scrollLeft, duration:0});
			}
		},
		restoreSaved: function() {
			if (!this.saved) return;
			if (this.saved.x && this.saved.y) {
				this.setPosition({
					x: this.saved.x,
					y: this.saved.y
				});
			}
			if (this.saved.height && this.saved.width) {
				this.setSize({
					height: this.saved.height,
					width: this.saved.width
				});
			} else {
				this.setSize({
					width: 106,
					height: 48
				});
			}
			if (this.saved.text) this.setText(this.saved.text);
			if (this.saved.css) {
				this.$(".textarea").css(this.saved.css);
				this.item.css = this.saved.css;
			}
		},
		setText: function(value, dontUpdate) {
			if (!dontUpdate) this.$(".textarea").val(value);
			this.item.text = value;
			if (App.selected && App.selected.nodes && App.selected.nodes[this.uid]) return
			if (value == "") {
				this.$(".selector").css({
					"stroke-width":5,
					"stroke":"rgb(193, 84, 84)"
				});
			} else if (!App.selected || !App.selected.nodes || !App.selected.nodes[this.uid]) {
				this.$(".selector").css({
					"stroke-width":"",
					"stroke":""
				});
			}
		},
		setSize: function(options) {

			var width = this.item.width = options.width;
			var height = this.item.height = options.height;

			if (width < 106) width = 106;
			if (height < 48) height = 48;

			var barSize = 8;

			this.$(".bartop").attr({
				y: height - barSize
			});
			this.$(".resizeleft").attr({
				x: width
			});
			this.$(".resizeleft-1").attr({
				x: width - ((barSize * 2) + 4)
			});
			this.$(".barheight").attr({
				height: barSize
			});
			this.$(".barwidth").attr({
				width: barSize
			});
			this.$(".fullheight").attr({
				height: height
			});
			this.$(".fullwidth").attr({
				width: width
			});
			this.$(".partialheight").attr({
				height: height - barSize
			});

			this.item.width = width;
			this.item.height = height;

		},
		setPosition: function(options) {
			
			this.item.x = options.x;
			this.item.y = options.y;

			this.svgAttributes.transform.translate[0] = this.item.x;
			this.svgAttributes.transform.translate[1] = this.item.y;
			this.$el.attr(this.getSVGAttributes());
			
		},
		getSVGAttributes: function() {
			var ret = {};
			for (var k in this.svgAttributes) {
				ret[k] = "";
				if (typeof this.svgAttributes[k] == "object") {
					for (var sk in this.svgAttributes[k]) {
						ret[k] += sk + "(" + this.svgAttributes[k][sk].join(",") + ") ";
					}
				} else {
					ret[k] += this.svgAttributes[k] + " ";
				}
			}
			for (var k in this.svgAttributes) {
				ret[k] = ret[k].trim();
			}
			return ret;
		},
		onDragResizeStart: function( event, pointer ) {
			if (!App.selected || !App.selected.nodes) return;
			if (!Object.keys(App.selected.nodes).length === 0) return;

			var ratio = App.data.diagram[App.data.diagram.current].zoom / 100;

			var offset = {
				x: parseInt($(event.handles[0]).attr("x")),
				y: parseInt($(event.handles[0]).attr("y"))
			};

			for (var k in App.selected.nodes) {
				var no = App.selected.nodes[k];
				no.startDrag = {};
				no.startDrag.x = no.item.x + offset.x;
				no.startDrag.y = no.item.y + offset.y;
				no.startDragPointer = {};
				no.startDragPointer.x = pointer.x;
				no.startDragPointer.y = pointer.y;
			}
		},
		onDragResizeMove: function(event, pointer) {
			if (!App.selected || !App.selected.nodes) return;
			if (!Object.keys(App.selected.nodes).length === 0) return;

			var ratio = App.data.diagram[App.data.diagram.current].zoom / 100;
			for (var k in App.selected.nodes) {
				var no = App.selected.nodes[k];
				var pointDifference = {
					x: (pointer.x - no.startDragPointer.x) / ratio,
					y: (pointer.y - no.startDragPointer.y) / ratio
				};
				var position = {
					x: no.startDrag.x + pointDifference.x,
					y: no.startDrag.y + pointDifference.y
				};
				no.setSize({
					width: position.x - no.item.x,
					height: position.y - no.item.y
				});
			}
			App.trigger("nodes:resize");
		},
		onDragStart: function( event, pointer ) {
			if (!App.selected || !App.selected.nodes) return;
			if (!Object.keys(App.selected.nodes).length === 0) return;

			var ratio = App.data.diagram[App.data.diagram.current].zoom / 100;
			for (var k in App.selected.nodes) {
				var no = App.selected.nodes[k];
				no.startDrag = {};
				no.startDrag.x = no.item.x;
				no.startDrag.y = no.item.y;
				no.startDragPointer = {};
				no.startDragPointer.x = pointer.x;
				no.startDragPointer.y = pointer.y;
			}
			
		},
		onDragMove: function( event, pointer ) {
			if (!App.selected || !App.selected.nodes) return;
			if (!Object.keys(App.selected.nodes).length === 0) return;

			var ratio = App.data.diagram[App.data.diagram.current].zoom / 100;
			for (var k in App.selected.nodes) {
				var no = App.selected.nodes[k];
				var pointDifference = {
					x: (pointer.x - no.startDragPointer.x) / ratio,
					y: (pointer.y - no.startDragPointer.y) / ratio
				};
				no.setPosition({
					x: no.startDrag.x + pointDifference.x,
					y: no.startDrag.y + pointDifference.y
				});
			}
			App.trigger("nodes:move");
		},
		onSelect: function() {
			if (!App.selected) App.selected = {};
			if (!App.selected.nodes) App.selected.nodes = {};

			console.log("select", this.uid);

			if (Object.keys(App.selected.nodes).length === 0) {
				App.initial = this.uid;
			}

			App.selected.nodes[this.uid] = this;
			this.$(".selector").css({
				"stroke-width": "8",
				"stroke": "rgb(84, 130, 193)"
			});
		
		},
		onUnSelect: function() {
			if (!App.selected || !App.selected.nodes) return;
			if (!App.selected.nodes[this.uid]) return;

			if (App.ctrlDown) return;
			console.log("unselect", this.uid);
			App.selected.nodes[this.uid] = this;
			if (this.item.text.trim() == "") {
				this.$(".selector").css({
					"stroke-width": "5",
					"stroke": "rgb(193, 84, 84)"
				});
			} else {
				this.$(".selector").css({
					"stroke-width": "",
					"stroke": ""
				});
			}
			delete App.selected.nodes[this.uid];
		},
		onSelectedRemove: function() {
			if (!App.selected || !App.selected.nodes) return;
			if (!App.selected.nodes[this.uid]) return;

			delete App.selected.nodes[this.uid];

			var keys = Object.keys(App.selected.nodes);

			if (keys.length > 0 && App.initial === this.uid) {
				App.initial = App.selected.nodes[keys[0]];
			}

			delete App.data.diagram[App.data.diagram.current].nodes[this.uid];

			App.trigger("nodes:remove");

			this.onRemove();
			this.remove();
		}
	});


	App.shiftDown = false, App.altDown = false, App.ctrlDown = false;

	$(window).on("keydown", function(event) {
		console.log(event.which);
		switch(event.which) {
		case  16:
			App.shiftDown = true;
			break;
		case  18:
			App.altDown = true;
			break;
		case  17:
			App.ctrlDown = true;
			break;
		}
		modifier(true);

		switch (event.which) {
		case 73: //i
		case 66: //b
		case 85: //u
		case 83: //s
		case 187: //+
		case 189: //-
			if (App.altDown)
				App.trigger("styleChange", event.which);
			break;
		}
	});
	$(window).on("keyup", function(event) {
		switch(event.which) {
		case  16:
			App.shiftDown = false;
			break;
		case  18:
			App.altDown = false;
			break;
		case  17:
			App.ctrlDown = false;
			break;
		}
		modifier(false);
	});

	function modifier(on) {
		if (on) {
			if (App.altDown) {
				App.trigger("altMod", true);
				$(".altmod").css({"display":"block"});
			}
		} else {
			App.trigger("altMod", false);
			$(".altmod").css({"display":"none"});
		}
	}

	return node;
});