var spawnController = require('spawn.controller');
var extensionConstructor = require('spawn.extension.constructor');
var spawnStorageConstructor = require('spawn.storage.constructor');
var spawnDefenseConstructor = require('spawn.defense.constructor');

var roleTower = require('role.tower');
var roleWorker = require('role.worker');
var roleGuard = require('role.guard');

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

	spawnController.run();
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
	
	var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
		filter: (t) => {
			return t.structureType == STRUCTURE_TOWER &&
				t.store.getCapacity(RESOURCE_ENERGY) > 0;
		}
	});
	for (var tower in towers) {
		roleTower.run(tower);
	} 

    	for(var name in Game.creeps) {
        	var creep = Game.creeps[name];
        	if(creep.memory.role == 'worker') {
            	roleWorker.run(creep);
        	}
		else if (creep.memory.role == 'guard') {
			roleGuard.run(creep);
		}
    	}
	
	var response = extensionConstructor.run(Game.spawns['Spawn1']);
	console.log(response);
	spawnStorageConstructor.run(Game.spawns['Spawn1']); 
	spawnDefenseConstructor.run(Game.spawns['Spawn1']);
    
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
}

//STRUCTURE_SPAWN constant for spawn building
