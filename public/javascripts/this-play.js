;(function (undefined) {
	'use strict';
	
	var this_play = this_play || {};

	this_play.classes = {};
	this_play.models = {};
	this_play.controllers = {};
	
	this.this_play = this_play;
	
}).call(this);
;(function (undefined) {
	'use strict';
	
	if (typeof this_play === 'undefined') {
		throw 'this_play is not declared';
	}
	
	function Item() {
		if (!(this instanceof Item)) {
			return new Item();
		}
	}
	
	Item.prototype.value = undefined;
	Item.prototype.attributes = {};
	
	Item.prototype.getValue = function () {
		return this.value;
	};
	
	Item.prototype.setValue = function (value) {
		this.value = value;
	};
	
	Item.prototype.getAttributes = function () {
		return this.attributes;
	};
	
	Item.prototype.setAttributes = function (attr) {
		for (var name in attr) {
			this.attributes[name] = attr[name];
		}
	};
	
	this_play.classes.Item = Item;
	
}).call(this);
;(function (undefined) {
	'use strict';
	
	if (typeof this_play === 'undefined') {
		throw 'this_play is not declared';
	}
	
	var module = (function () {
		
		function toArray(constructor, length) {
			var array = [];
			
			for (var i = 0; i < length; i++) {
				array.push(new constructor());
			}
			
			return {
				array: array,
				type: constructor.type
			};
		}
		
		return {
			toArray: toArray
		};
		
	})();
	
	
	this_play.models = module;
	
}).call(this);
;(function (undefined) {
	'use strict';
	
	if (typeof this_play === 'undefined') {
		throw 'this_play is not declared';
	}
	
	var Integer = function () {
		this.item = new this_play.classes.Item();
		this.item.setValue(0);
		this.item.setAttributes({
			color: 'black',
			background: 'white'
		});
	};
	
	Integer.prototype.item = undefined;
	Integer.type = "number";
	
	Integer.prototype.getValue = function () {
		return this.item.getValue();
	};
	
	Integer.prototype.setValue = function (val) {
		if (typeof val !== Integer.type) {
			throw new TypeError('type error');
		}
		this.item.setValue(val);
	};
	
	Integer.prototype.getAttributes = function () {
		return this.item.getAttributes();
	};
	
	Integer.prototype.setAttributes = function (attr) {
		this.item.setAttributes(attr);
	};
	
	this_play.models.Integer = Integer;
	
}).call(this);
;(function (undefined) {
	'use strict';
	
	if (typeof this_play === 'undefined') {
		throw 'this_play is not declared';
	}
	
	var Controller = function (model) {
		this.model = model;
		this.events = {};
	};
	
	Controller.prototype.update = function (data) {
		var before = this.getValue();
		this.model.setValue(data);
		var after = this.getValue();
		
		if (this.events.update) {
			this.events.update(before, after);
		}
		
		if (this.events.change && before !== after) {
			this.events.change(before, after);
		}
	};
	
	Controller.prototype.on = function (event, callback) {
		this.events[event] = callback;
	};

	Controller.prototype.getValue = function () {
		return this.model.getValue();
	};
	
	var ArrayController = function (model) {
		Controller.apply(this, arguments);
	};
	
	ArrayController.prototype = new Controller();
	
	ArrayController.prototype.update = function (data) {
		if (!Array.isArray(data)) {
			throw TypeError("data is not array");
		}
		
		if (data.length != this.model.array.length) {
			throw RangeError("data range error");
		}
		
		var that = this;
		data.forEach(function (d) {
			if (typeof d !== that.model.type) {
				throw TypeError("type error");
			}
		});
		
		var before = this.getValue();
		data.forEach(function (d, i) {
			that.model.array[i].setValue(d);
		});
		var after = this.getValue();
		
		if (this.events.update) {
			this.events.update(before, after);
		}
		
		if (this.events.change && before.toString() !== after.toString()) {
			this.events.change(before, after);
		}
	};
	
	ArrayController.prototype.getValue = function () {
		var retArray = [];
		this.model.array.forEach(function (item) {
			retArray.push(item.getValue());
		});
		return retArray;
	};

	var module = (function () {
				
		var create = function (model) {
			if (model.array) {
				return new ArrayController(model);
			}
			
			return new Controller(model);
		};
		
		return {
			create: create
		};
		
	})();
	
	this_play.controllers = module;
	
}).call(this);
;(function (undefined) {
	'use strict';
	
	if (typeof this_play === 'undefined') {
		throw 'this_play is not declared';
	}

	var Scheduler = function () {
		this.targets = [];
	};

	Scheduler.prototype.addTarget = function (target) {
		if (Array.isArray(target)) {
			var that = this;
			target.forEach(function (item) {
				that.addTarget(item);
			});
			return;
		}

		// TODO: To implement polymorphism
		var model;
		if (target.isArray) {
			model = this_play.models.toArray(
				this_play.models.Integer, target.length
			);
		}
		else {
			model = new this_play.models.Integer();
		}

		this.targets[target.name] = this_play.controllers.create(model);

		if (target.init) {
			this.targets[target.name].update(target.init);
		}		
	};

	Scheduler.prototype.step = function (step) {
		for (var name in step) {
			this.targets[name].update(step[name]);
		}
	};

	this_play.Scheduler = Scheduler;

	
}).call(this);