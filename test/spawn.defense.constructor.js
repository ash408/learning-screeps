"use strict";

let utils = require('utils');


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
	},

	buildRamparts: function(room) {
		let structures = room.find(FIND_STRUCTURES, {
			filter:(t) => {
				return t.structureType !== STRUCTURE_RAMPART &&
					 t.structureType !== STRUCTURE_ROAD &&
					 t.structureType !== STRUCTURE_WALL
			}
		});

		let minX = 49; let maxX = 0;
		let minY = 49; let maxY = 0;

		for (let structure of structures) {
			let pos = structure.pos;

			if (pos.x < minX) { minX = pos.x; }
			if (pos.x > maxX) { maxX = pos.x; }

			if (pos.y < minY) { minY = pos.y; }
			if (pos.y > maxY) { maxY = pos.y; }
		}

		let coordinates = utils.calculateRectangle(minX, minY, maxX, maxY);

		for (let coordinate of coordinates) {
			room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_RAMPART);
		}
	}
};

module.exports = spawnDefenseConstructor;
