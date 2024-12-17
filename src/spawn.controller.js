const MAX_WORKERS = 10;

const MOVE_COST = 50;
const WORK_COST = 100;
const CARRY_COST = 50;
const ATTACK_COST = 80;
const TOUGH_COST = 10;

const BODY_HASH = {[MOVE]: MOVE_COST, [WORK]: WORK_COST, [CARRY]: CARRY_COST,
				[ATTACK]: ATTACK_COST, [TOUGH]: TOUGH_COST};

const WORKER_TEMPLATE = [MOVE, MOVE, CARRY, WORK];
const GUARD_TEMPLATE = [TOUGH, MOVE, ATTACK, MOVE];

var spawnController = {
		
	run: function() {
		var spawnHash = Game.spawns;
		var spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });
		
		var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
		var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');
		
		if (spawns[0].room.find(FIND_HOSTILE_CREEPS).length > guards.length) {
			var newName = 'Guard' + Game.time;
			var creepBody = this.calculateBody(spawns[0].room, GUARD_TEMPLATE);

			if (creepBody !== null) {
				spawns[0].spawnCreep(creepBody, newName,
					{memory: {role: 'guard'}});
			}
		}
		else if (workers.length < MAX_WORKERS) {
			var newName = 'Worker' + Game.time;
			var creepBody = this.calculateBody(spawns[0].room, WORKER_TEMPLATE);

			if (creepBody !== null) {
				spawns[0].spawnCreep(creepBody, newName,
					{memory: {role: 'worker'}});
			}
		}
	},

	calculateBody: function(room, template) {
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
