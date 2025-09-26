"use strict";

let utils = {

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

	calculateRectangle: function(startX, startY, endX, endY) {
		let currentX = startX;
		let currentY = startY;

		coordinates = [];

		while (currentY <= endY) {

			while (currentX <= endX) {
				if (currentY === startY || currentY === endY) ||
					(currentX === startX || currentX === endX)){
					
					coordinates.push({x: currentX, y: currentY});
				}
				currentX++;
			}
			currentY++;
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

module.exports = utils;
