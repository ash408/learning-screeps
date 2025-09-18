"use strict";

let globalItems = require('global');
let memoryController = require('memory.controller');
let colonyController = require('colony.controller');
let colonyCheck = require('colony.check');
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

	let currentTick = Game.time;
	console.log(currentTick);

	if (currentTick >= Memory.lastCheck + 100) {
		colonyCheck.run();
		console.log("Colony check has run");
		Memory.lastCheck = currentTick;
	}
};
