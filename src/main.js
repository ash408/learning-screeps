//var spawnController = require('spawn.controller');
//var spawnConstructor = require('spawn.constructor');
//var extensionConstructor = require('spawn.extension.constructor');
//var spawnStorageConstructor = require('spawn.storage.constructor');
//var spawnDefenseConstructor = require('spawn.defense.constructor');
//var roadConstructor = require('road.constructor');
var colonyController = require('colony.controller');
var expansionController = require('expansion.controller');

//var roleTower = require('role.tower');
var roleWorker = require('role.worker');
var roleUpgrader = require('role.upgrader');
var roleGuard = require('role.guard');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {
	if (Memory.hasRoads === undefined) {
		Memory.hasRoads = {};
	}
	if (Memory.expansion === undefined) {
		Memory.expansion = false;
	}
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    //if(Game.spawns['Spawn1'].spawning) { 
    //    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    //    Game.spawns['Spawn1'].room.visual.text(
    //        '🛠️' + spawningCreep.memory.role,
    //        Game.spawns['Spawn1'].pos.x + 1, 
    //        Game.spawns['Spawn1'].pos.y, 
    //        {align: 'left', opacity: 0.8});
   // }
	
	//var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
	//	filter: (t) => {
	//		return t.structureType == STRUCTURE_TOWER &&
	//			t.store.getCapacity(RESOURCE_ENERGY) > 0;
	//	}
	//});
	//for (var tower of towers) {
	//	roleTower.run(tower);
	//} 
	colonyController.run();

    	for(var name in Game.creeps) {
        	var creep = Game.creeps[name];
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
	
	//var response = extensionConstructor.run(Game.spawns['Spawn1']);

	//if (response !== OK) {
	//	spawnStorageConstructor.run(Game.spawns['Spawn1']); 
	//	spawnDefenseConstructor.run(Game.spawns['Spawn1']);
	//	spawnConstructor.run(Game.spawns['Spawn1']);
	//}

	//var hasRoads = Memory.hasRoads;
	//var constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
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
		var spawnHash = Game.spawns;
		var spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });
		var sites = [];

		for (var spawn of spawns){
			var thisSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
			sites = [...sites, ...thisSites];
		}
		for (var site of sites) {
			site.remove();
		}
	}

	global.startExpansion = function(startRoom, expansionTarget) {
		Memory.expansion = true;
		Memory.startExpansionRoom = startRoom;
		Memory.expansionTarget = expansionTarget;
	}

	global.clearWorkers = function() {
		for (var name in Game.creeps) {
			var creep = Game.creeps[name];

			if(creep.memory.role == 'worker') {
				creep.memory.task = 'harvesting';
			}
		}
	}
};


//STRUCTURE_SPAWN constant for spawn building
