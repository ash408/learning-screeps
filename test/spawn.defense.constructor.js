"use strict";


let spawnDefenseConstructor = {

	run: function(spawn) {
		let x = spawn.pos.x + 1;
		let y = spawn.pos.y + 1;

		let x2 = spawn.pos.x + 1;
		let y2 = spawn.pos.y - 1;

		if (!this.hasTower(spawn, x, y)) {
			spawn.room.createConstructionSite(x, y, STRUCTURE_TOWER);
		}
		else {
			let rcl = spawn.room.controller.level;

			if (rcl > 4 && !this.hasTower(x2, y2)) {
				spawn.room.createConstructionSite(x2, y2, STRUCTURE_TOWER);
			}
		}
	},

	hasTower: function(spawn, x, y) {
		return spawn.room.lookForAt(LOOK_STRUCTURES, x, y).length !== 0;
	}
};

module.exports = spawnDefenseConstructor;
