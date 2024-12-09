var extensionConstructor = {

	run: function(spawn) {
		var startX = spawn.pos.x - 1;
		var startY = spawn.pos.y - 1;

		return this.findValidLocation(spawn.room, startX, startY);	
	},
	
	findValidLocation: function(room, startX, startY, length=3) {
		if (startX < 0 || startY < 0) { return null; }
		
		var coordinates = this.calculateSquare(startX, startY, length);
		for (var coordinate of coordinates){
			console.log(coordinate);
			console.log("Attempting to build extension at: X" + coordinate.x + ", Y" + coordinate.y);

			var validationCoordinates = this.calculateCrosshair(coordinate.x, coordinate.y);
			var isValid = this.validateCoordinates(room, validationCoordinates)
			
			if (isValid) {
				var response = room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_EXTENSION);
				if (response !== ERR_INVALID_TARGET) { return response; }
			}
		}

		startX--; startY--; length++;
		return this.findValidLocation(room, startX, startY, length);	
	},

	validateCoordinates: function(room, x, y) {
		var sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
		return sites.length === 0;
	}

	validateCoordinates: function(room, coordinates) {
		for (var coordinate of coordinates) {
			var validation = this.validateCoordinates(room, coordinate.x, coordinate.y);
			if (!validation) { return false; }
		}
		return true;
	}

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
	}

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
