"use strict";

let utils = require('utils');


let spawnStorageConstructor = {
	
	run: function(spawn) {
		let hasExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_EXTENSION;
			}
		}).length > 0;
		let hasSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length !== 0;

		if (hasExtensions && !hasSites) {
			let x = spawn.pos.x - 1;
			let y = spawn.pos.y - 1;
		
			this.buildContainer(spawn, x, y);

			x = spawn.pos.x - 1;
			y = spawn.pos.y + 1;

			this.buildContainer(spawn, x, y);
			return;
		}
		
		let rcl = spawn.room.controller.level;
		if (hasExtensions && !hasSites && rcl >= 4) {
			this.buildStorage(spawn);
		}
	},

	buildContainer: function(spawn, x, y) {
		spawn.room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
	},

	buildStorage: function(spawn) {
		let startX = spawn.pos.x - 2;
		let startY = spawn.pos.y - 2;

		return this.findValidLocation(spawn.room, startX, startY);
	},

	findValidLocation(room, startX, startY, length=5) {
		if (startX < 0 || startY < 0) { return null; }

		let coordinates = utils.calculateSquare(startX, startY, length);
		for (let coordinate of coordinates) {
			let validationCoordinates = utils.calculateCrosshair(coordinate.x, coordinate.y);
			let isValid = utils.validateCoordinates(room, validationCoordinates);

			if (isValid) {
				let response = room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_STORAGE);
				if (response === OK) {
					let roadCoordinates = utils.calculateCrosshair(coordinate.x, coordinate.y);

					for (let roadCoordinates of roadCoordinates) {
						if (coordinate.x !== roadCoordinate.y ||
							coordinate.y !== roadCoordinate.y) {
							room.createConstructionSite(roadCoordinate.x, roadCoordinate.y, STRUCTURE_ROAD);
						}
					}
					return response;
				}
				else if (response !== ERR_INVALID_TARGET) { return response; }
			}
		}

		startX--; startY--; length+=2;
		return this.findValidLocation(room, startX, startY, length);
	}
};

module.exports = spawnStorageConstructor;
