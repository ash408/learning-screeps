var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");

module.exports.loop = function() {

	for (var name in Memory.creeps) {

		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memeory:', name);
		}
	}
	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

	if (harvesters.length < 5) {
		var newName = 'Harvester' + Game.time;
		console.log('Spawning new harvester: ' + newName);

		Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
			{memory: {role: 'harvester'}});
	}

 if (harvesters.length < 5) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);

                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                        {memory: {role: 'harvester'}});
        }
