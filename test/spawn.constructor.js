"use strict";

let utils = require('utils');


let spawnConstructor = {
	
	run: function(spawn) {
		let spawnX = spawn.pos.x;
		let spawnY = spawn.pos.y;

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
	},

	findMidpoint: function(room) {
		let sources = room.find(FIND_SOURCES);
		let controller = room.controller.pos;

		let allPOI = [];
		for (let source of sources) {
			allPOI.push(source.pos);
		}
		allPOI.push(controller);

		let minX = 51;
		let maxX = -1;
		let minY = 51;
		let maxY = -1;

		for (let pos of allPOI) {
			if (pos.x < minX) { minX = pos.x; }
			if (pos.x > maxX) { maxX = pos.x; }

			if (pos.y < minY) { minY = pos.y; }
			if (pos.y > maxY) { maxY = pos.y; }
		}

		let x = Math.round((minX + maxX) / 2);
		let y = Math.round((minY + maxY) / 2);

		return new RoomPosition(x, y, room.name);
	},

	findValidLocation: function(room, startX, startY, length=1) {
		if (startX < 0 || startY < 0) { return null; }

		let coordinates = utils.calculateSquare(startX, startY, length);
		for (let coordinate of coordinates) {
			let validationCoordinates = utils.calculateSquare(coordinate.x-1, coordinate.y-1, length=3);
			validationCoordinates.push({x: coordinate.x, y: coordinate.y});
			let isValid = utils.validateCoordinates(room, validationCoordinates);

			if (isValid) {
				return new RoomPosiiton(coordinate.x, coordinate.y, room.name);
			}
		}
		startX--; startY--; length+=2;
		return this.findValidLocation(room, startX, startY, length;
	},

	findBuildLocation: function(room) {
		let midPoint = this.findMidpoint(room);
		let validPoint = this.findValidLocation(room, midPoint.x, midPoint.y)
		return validPoint;
	}
};

module.exports = spawnConstructor;
