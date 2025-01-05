"use strict";

let globalItems = require('global');
let creepController = require('creep.controller');


module.exports.loop = function () {
	
	if (Memory.hasRoads === undefined) {
		Memory.hasRoads = {};
	}
	if (Memory.expansion === undefined) {
		Memory.expansion = false;
	}
    
    	for(let name in Memory.creeps) {
     	if(!Game.creeps[name]) {
          	delete Memory.creeps[name];
        	}
    	}
    
	globalItems.load();

	colonyController.run();
	creepController.run();
	
   	if(Memory.expansion === false && Game.cpu.bucket == 10000) {
       	Game.cpu.generatePixel();
    	}
	else if (Memory.expansion === true) {
		expansionController.run();
	}
};
