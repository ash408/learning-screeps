"use strict";


let spawnDefenseConstructor = {

	run: function(spawn) {
		let x = spawn.pos.x + 1;
		let y = spawn.pos.y + 1;

		let hasTower = spawn.room.lookForAt(LOOK_STRUCTURES, x, y).length !== 0;
		if (!hasTower) {
			spawn.room.createConstructionSite(x, y, STRUCTURE_TOWER);
		}
	}
};

module.exports = spawnDefenseConstructor;
