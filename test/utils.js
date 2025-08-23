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

module.exports = utils;
