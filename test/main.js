"use strict";

require('global.js');

let roadConstructor = require('road.constructor');
let colonyController = require('colony.controller');
let expansionController = require('expansion.controller');
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
    
	colonyController.run();
	creepController.run();
	
   	if(Memory.expansion === false && Game.cpu.bucket == 10000) {
       	Game.cpu.generatePixel();
    	}
	else if (Memory.expansion === true) {
		expansionController.run();
	}
};
