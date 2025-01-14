"use strict";

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
		
		let coordinates = this.calculateSquare(startX, startY, length);
		for (let coordinate of coordinates){
			let validationCoordinates = this.calculateCrosshair(coordinate.x, coordinate.y);
			let isValid = this.validateCoordinates(room, validationCoordinates);
			
			if (isValid) {
				let response = room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_EXTENSION);
				if (response === OK) {
					let roadCoordinates = this.calculateCrosshair(coordinate.x, coordinate.y);
	
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
	},

	calculateSquare: function(startX, startY, length) {
		let currentX = startX;
		let currentY = startY;
		
		let maxX = startX + length - 1;
		let maxY = startY + length - 1;

		let coordinates = [];


		for (; currentY <= maxY; currentY++) {
		
			if (currentY === startY || currentY === (startY + length) - 1) {

				for (; currentX <= maxX; currentX++){
					coordinates.push({x: currentX, y: currentY});
				}
				currentX = startX;
			}
			else {
				coordinates.push({x: currentX, y: currentY});
				coordinates.push({x: (currentX + length) - 1, y: currentY});
			}
		}
		return coordinates;
	},

	//Add length support
	calculateCrosshair: function(x, y) {
		let coordinates = [];

		coordinates.push({x: x, y: y});
		coordinates.push({x: x-1, y: y});
		coordinates.push({x: x+1, y: y});
		coordinates.push({x: x, y: y+1});
		coordinates.push({x: x, y: y-1});

		return coordinates;
	}
};

module.exports = extensionConstructor;
