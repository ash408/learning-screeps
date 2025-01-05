"use strict";

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

	global.clearSites = function() {
		let spawnHash = Game.spawns;
		let spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });
		let sites = [];

		for (let spawn of spawns){
			let thisSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
			sites = [...sites, ...thisSites];
		}
		for (let site of sites) {
			site.remove();
		}
	}

	global.startExpansion = function(startRoom, expansionTarget) {
		Memory.expansion = true;
		Memory.startExpansionRoom = startRoom;
		Memory.expansionTarget = expansionTarget;
	}

	global.clearWorkers = function() {
		for (let name in Game.creeps) {
			let creep = Game.creeps[name];

			if(creep.memory.role == 'worker') {
				creep.memory.task = 'harvesting';
			}
		}
	}

	global.createRoads = function(roomName) {
		let room = Game.rooms[roomName];

		if (room !== undefined) {
			roadConstructor.run(room);
		}
	}
};
