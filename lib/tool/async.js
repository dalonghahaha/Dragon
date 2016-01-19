"use strict";

class async {
	static *map(mission,promise) {
		var data = [];
		var count = 0;
		for (var i = 0; i <mission.length; i++) {
			var result = yield promise(mission[i]);
			data.push(result);
		};
		return data;
  	}
}

module.exports = async;