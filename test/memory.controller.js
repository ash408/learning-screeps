"use strict";


let memoryController = {

	run: function() {
		this.cleanDead();
		this.initialize();
	},

	cleanDead: function() {

		for (let name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
			}
		}
	},

	initialize: function() {

		if (Memory.hasRoads === undefined) {
			Memory.hasRoads = {};
		}
		if (Memory.expansion === undefined) {
			Memory.expansion = false;
		}
		if (Memory.lastCheck === undefined) {
			Memory.lastCheck = Game.time;
		}
	}
};

module.exports = memoryController;
