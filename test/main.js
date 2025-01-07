"use strict";

let globalItems = require('global');
let memoryController = require('memory.controller');
let colonyController = require('colony.controller');
let creepController = require('creep.controller');
let expansionController = require('expansion.controller');


module.exports.loop = function () {

	globalItems.load();
	memoryController.run();	
	
	colonyController.run();
	creepController.run();

   	if(Game.cpu.bucket == 10000) {
       	Game.cpu.generatePixel();
    	}
	if (Memory.expansion === true) {
		expansionController.run();
	}
};
