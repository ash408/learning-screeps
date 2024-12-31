"use strict";


let spawnConstructor = {

	run: function(spawn) {
		spawnX = spawn.pos.x;
		spawnY = spawn.pos.y;

		let coordinates = [	{x: spawnX - 1, y: spawnY},
						{x: spawnX + 1, y: spawnY},
						{x: spawnX, y: spawnY - 1},
						{x: spawnX, y: spawnY + 1} ]

		for (let coordinate of coordinates) {
			let hasRoad = spawn.room.lookForAt(LOOK_STRUCTURES, coordinate.x, coordinate.y).length !== 0;
			let hasSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
			
			if (!hasRoad && !hasSites) {
				spawn.room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
			}
		}
	}
};

module.exports = spawnConstructor;
