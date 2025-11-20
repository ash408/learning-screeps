"use strict";


let spawnDefenseConstructor = {

	run: function(spawn) {
		let x = spawn.pos.x + 1;
		let y = spawn.pos.y + 1;

		let x2 = spawn.pos.x + 1;
		let y2 = spawn.pos.y - 1;

		spawn.room.createConstructionSite(x, y, STRUCTURE_TOWER);
		
		let rcl = spawn.room.controller.level;

		if (rcl > 4) {
			spawn.room.createConstructionSite(x2, y2, STRUCTURE_TOWER);
		}
	}
};

module.exports = spawnDefenseConstructor;
