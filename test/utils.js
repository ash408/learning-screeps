"use strict";

let util = {

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
	}
}

module.export = util;
