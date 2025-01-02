"use strict";

//let spawnController = require('spawn.controller');
//let spawnConstructor = require('spawn.constructor');
//let extensionConstructor = require('spawn.extension.constructor');
//let spawnStorageConstructor = require('spawn.storage.constructor');
//let spawnDefenseConstructor = require('spawn.defense.constructor');
let roadConstructor = require('road.constructor');
let colonyController = require('colony.controller');
let expansionController = require('expansion.controller');

//let roleTower = require('role.tower');
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
    
    //if(Game.spawns['Spawn1'].spawning) { 
    //    let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    //    Game.spawns['Spawn1'].room.visual.text(
    //        '🛠️' + spawningCreep.memory.role,
    //        Game.spawns['Spawn1'].pos.x + 1, 
    //        Game.spawns['Spawn1'].pos.y, 
    //        {align: 'left', opacity: 0.8});
   // }
	
	//let towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
	//	filter: (t) => {
	//		return t.structureType == STRUCTURE_TOWER &&
	//			t.store.getCapacity(RESOURCE_ENERGY) > 0;
	//	}
	//});
	//for (let tower of towers) {
	//	roleTower.run(tower);
	//} 
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
	
	//let response = extensionConstructor.run(Game.spawns['Spawn1']);

	//if (response !== OK) {
	//	spawnStorageConstructor.run(Game.spawns['Spawn1']); 
	//	spawnDefenseConstructor.run(Game.spawns['Spawn1']);
	//	spawnConstructor.run(Game.spawns['Spawn1']);
	//}

	//let hasRoads = Memory.hasRoads;
	//let constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
	//if (!hasRoads && Game.cpu.bucket === 10000 && constructionSites.length === 0) {
	//	roadConstructor.run(Game.spawns['Spawn1'].room);
	//}
    
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


//STRUCTURE_SPAWN constant for spawn building
