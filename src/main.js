var extensionConstructor = require('spawn.extension.constructor');

var roleWorker = require('role.worker');

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    console.log('Workers: ' + workers.length);
    
    if(workers.length < 10) {
        var newName = 'Worker' + Game.time;
        console.log('Spawning new worker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'worker'}});
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    	for(var name in Game.creeps) {
        	var creep = Game.creeps[name];
        	if(creep.memory.role == 'worker') {
            	roleWorker.run(creep);
        	}
    	}
	
	var response = extensionConstructor.run(Game.spawns['Spawn1']);
	console.log(response); 
    
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
}

//STRUCTURE_SPAWN constant for spawn building
