"use strict";

let utils = require('utils');


let extensionConstructor = {

	run: function(spawn) {
		if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length === 0) {
			let startX = spawn.pos.x - 2;
			let startY = spawn.pos.y - 2;

			return this.findValidLocation(spawn.room, startX, startY);	
		}
	},
	
	findValidLocation: function(room, startX, startY, length=5) {
		if (startX < 0 || startY < 0) { return null; }
		
		let coordinates = utils.calculateSquare(startX, startY, length);
		for (let coordinate of coordinates){
			let validationCoordinates = utils.calculateCrosshair(coordinate.x, coordinate.y);
			let isValid = this.validateCoordinates(room, validationCoordinates);
			
			if (isValid) {
				let response = room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_EXTENSION);
				if (response === OK) {
					let roadCoordinates = utils.calculateCrosshair(coordinate.x, coordinate.y);
	
					for (let roadCoordinate of roadCoordinates) {
						if (coordinate.x !== roadCoordinate.x ||
							coordinate.y !== roadCoordinate.y){
							room.createConstructionSite(roadCoordinate.x, roadCoordinate.y, STRUCTURE_ROAD);
						}
					}
					return response;
				}
				else if (response !== ERR_INVALID_TARGET){ return response; }
			}
		}

		startX--; startY--; length+=2;
		return this.findValidLocation(room, startX, startY, length);	
	},

	validateCoordinate: function(room, x, y) {
		let sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
		let structures = room.lookForAt(LOOK_STRUCTURES, x, y);
		let terrain = room.lookForAt(LOOK_TERRAIN, x, y);

		let validStructure = structures.length === 0;

		if (structures.length > 0 && structures[0].structureType === STRUCTURE_ROAD) {
			validStructure = true;
		}

		let isValid = sites.length === 0 && terrain != 'wall' && validStructure;
		return isValid;
	},

	validateCoordinates: function(room, coordinates) {
		for (let coordinate of coordinates) {
			let validation = this.validateCoordinate(room, coordinate.x, coordinate.y);
			if (!validation) { return false; }
		}
		return true;
	}
};

module.exports = extensionConstructor;
