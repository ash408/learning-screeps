"use strict";

let roadConstructor = require('road.constructor');
let colonyController = require('colony.controller');
let expansionController = require('expansion.controller');

let roleWorker = require('role.worker');
let roleUpgrader = require('role.upgrader');
let roleGuard = require('role.guard');
let roleClaimer = require('role.claimer');


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

    	for(let name in Game.creeps) {
        	let creep = Game.creeps[name];
        	
		if(creep.memory.role == 'worker') {
            	roleWorker.run(creep);
        	}
		else if (creep.memory.role == 'guard') {
			roleGuard.run(creep);
		}
		else if (creep.memory.role == 'upgrader') {
			roleUpgrader.run(creep);
		}
		else if (creep.memory.role == 'claimer') {
			roleClaimer.run(creep);
		}
    	}
	
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
