const MAX_WORKERS = 10;

var spawnController = {
		
	run: function() {
		var spawnHash = Game.spawns;
		var spawns = Game.spawns.map(function(v) { return spawnHash[v]; });
		var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');

		if (workers.length < MAX_WORKERS){
			var newName = 'Worker' + Game.time;
			spawns[0].spawnCreep([WORK, CARRY, MOVE], newName,
				{memory: {role: 'worker'}});
		}
	} 
};

module.exports = spawnController;
