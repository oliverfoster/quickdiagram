define(function() {
	var throttle = window.throttle = function(name, cb, timeout) {

		throttle.extend(this);

		var item = add.call(this, name);

		if (item._throttling) {
			if ( (new Date()).getTime() - item._started > 250) {
				//console.log("UNBLOCKING THROTTLE", name, "ON", this);
				reset(item);
			} else return;
		}
		if (item._waiting) clearTimeout(item._timeout);
		item._waiting = true;
		item._timeout = setTimeout(_.bind(execute, this, item, cb), timeout || 1);

	};

	var add = function(name) {
		if (!this._throttle[name]) {
			this._throttle[name] = {
				_throttling: false,
				_waiting: false
			};
		}
		return this._throttle[name];
	};

	var reset = function(item) {
		_.extend(item, {
			_throttling: false,
			_waiting: false
		});
	};

	var done = function(name) {
		if (this._throttle && this._throttle[name]) {
			//console.log("unthrottling", name);
			this._throttle[name]._throttling = false;
		}
	};

	var execute = function(item, cb) {
		item._started = (new Date()).getTime();
		item._throttling = true;
		item._waiting = false;
		//console.log("throttling", name);
		cb.call(this);
	};

	throttle.extend = function(obj) {
		if (!obj._throttle) {
			obj._throttle = {};
			obj.done = done;
			obj.throttle = throttle;
		}
	};
});