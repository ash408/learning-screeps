var extensionConstructor = {

	run: function(spawn) {
		if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length === 0) {
			var startX = spawn.pos.x - 2;
			var startY = spawn.pos.y - 2;

			return this.findValidLocation(spawn.room, startX, startY);	
		}
	},
	
	findValidLocation: function(room, startX, startY, length=5) {
		if (startX < 0 || startY < 0) { return null; }
		
		var coordinates = this.calculateSquare(startX, startY, length);
		for (var coordinate of coordinates){

			var validationCoordinates = this.calculateCrosshair(coordinate.x, coordinate.y);
			var isValid = this.validateCoordinates(room, validationCoordinates)
			
			if (isValid) {
				var response = room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_EXTENSION);
				if (response !== ERR_INVALID_TARGET) { return response; }
			}
			else if (this.validateCoordinate(room, coordinate.x, coordinate.y)) {
				room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
			}
		}

		startX--; startY--; length+=2;
		return this.findValidLocation(room, startX, startY, length);	
	},

	validateCoordinate: function(room, x, y) {
		var sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
		var structures = room.lookForAt(LOOK_STRUCTURES, x, y);
		var terrain = room.lookForAt(LOOK_TERRAIN, x, y);
		
		var isValid = sites.length === 0 && structures.length === 0 && terrain != 'wall';

		return sites.length === 0 && structures.length === 0 && terrain != 'wall';
	},

	validateCoordinates: function(room, coordinates) {
		for (var coordinate of coordinates) {
			var validation = this.validateCoordinate(room, coordinate.x, coordinate.y);
			if (!validation) { return false; }
		}
		return true;
	},

	calculateSquare: function(startX, startY, length) {
		var currentX = startX;
		var currentY = startY;
		
		var maxX = startX + length - 1;
		var maxY = startY + length - 1;

		var coordinates = [];


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
		var coordinates = [];

		coordinates.push({x: x, y: y});
		coordinates.push({x: x-1, y: y});
		coordinates.push({x: x+1, y: y});
		coordinates.push({x: x, y: y+1});
		coordinates.push({x: x, y: y-1});

		return coordinates;
	}
};

module.exports = extensionConstructor;
