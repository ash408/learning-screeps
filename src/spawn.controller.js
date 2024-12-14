const MAX_WORKERS = 10;

const MOVE_COST = 50;
const WORK_COST = 100;
const CARRY_COST = 50;

const BODY_HASH = {[MOVE]: MOVE_COST, [WORK]: WORK_COST, [CARRY]: CARRY_COST};
const WORKER_TEMPLATE = [MOVE, MOVE, CARRY, WORK];

var spawnController = {
		
	run: function() {
		var spawnHash = Game.spawns;
		var spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });
		var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');

		if (workers.length < MAX_WORKERS) {
			var newName = 'Worker' + Game.time;
			var creepBody = this.calculateBody(spawns[0].room);

			if (creepBody !== null) {
				spawns[0].spawnCreep(creepBody, newName,
					{memory: {role: 'worker'}});
			}
		}
	},

	calculateBody: function(room) {
		var template = WORKER_TEMPLATE;
		var body = template.slice(0);
		var totalEnergy = room.energyAvailable;

		while (totalEnergy > this.calculateEnergy(body)){

			for (part of template){
				var testBody = body.slice(0);
				testBody.push(part);

				if(this.calculateEnergy(testBody) > totalEnergy ||
					testBody.length > 50){

					return body;
				}
				else{
					body.push(part);
				}
			}
		}
		return null;
	},

	calculateEnergy: function(bodyParts) {
		var totalEnergy = 0;

		for (part of bodyParts) {
			totalEnergy += BODY_HASH[part];
		}
		return totalEnergy;
	}
};

module.exports = spawnController;
