const MAX_UPGRADERS = 1;
const MAX_SETTLERS = 3;
const MAX_CLAIMERS = 1;

const WORKERS_PER_SOURCE = 3;

const MOVE_COST = 50;
const WORK_COST = 100;
const CARRY_COST = 50;
const ATTACK_COST = 80;
const TOUGH_COST = 10;
const CLAIM_COST = 600;

const BODY_HASH = {[MOVE]: MOVE_COST, [WORK]: WORK_COST, [CARRY]: CARRY_COST,
				[ATTACK]: ATTACK_COST, [TOUGH]: TOUGH_COST, [CLAIM]: CLAIM_COST};

const WORKER_TEMPLATE = [MOVE, CARRY, WORK];
const GUARD_TEMPLATE = [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK];
const CLAIMER_TEMPLATE = [MOVE, MOVE, MOVE, WORK, CARRY, CLAIM];


var spawnController = {
		
	run: function(spawn) {
		var creeps = spawn.room.find(FIND_MY_CREEPS);
		var sources = spawn.room.find(FIND_SOURCES);

		var MAX_WORKERS = sources.length * WORKERS_PER_SOURCE;
	
		var workers = _.filter(creeps, (creep) => creep.memory.role == 'worker');
		var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
		var guards = _.filter(creeps, (creep) => creep.memory.role == 'guard');
	
		if (this.needsGuard(spawn.room, guards)) {
			var newName = 'Guard' + Game.time;
			var creepBody = this.calculateBody(spawn.room, GUARD_TEMPLATE);

			if (creepBody !== null) {
				spawn.spawnCreep(creepBody, newName,
					{memory: {role: 'guard'}});
			}
		}
		else if (upgraders.length < MAX_UPGRADERS) {
			var newName = 'Upgrader' + Game.time;
			var creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);

			if (creepBody !== null) {
				spawn.spawnCreep(creepBody, newName,
					{memory: {role: 'upgrader'}});
			}
		}
		else if (workers.length < MAX_WORKERS) {
			var newName = 'Worker' + Game.time;
			var creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);

			if (creepBody !== null) {
				spawn.spawnCreep(creepBody, newName,
					{memory: {role: 'worker'}});
			}
		}
	},

	spawnClaimer: function(spawn) {
		if (!spawn.spawning) {
			var claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
			
			if (claimers.length < MAX_CLAIMERS) {
				var newName = 'Claimer' + Game.time;
				var creepBody = this.calculateBody(spawn.room, CLAIMER_TEMPLATE);

				if (creepBody !== null) {
					spawn.spawnCreep(creepBody, newName,
						{memory: {role: 'claimer'}});
				}
			}
		}
	},

	spawnSettler: function(spawn, target) {
		if (!spawn.spawning) {
			console.log("Spawning settler");
			var creeps = target.find(FIND_MY_CREEPS);
			var workers = _.filter(creeps, (creep) => creep.memory.role == 'worker');

			if (workers.length < MAX_SETTLERS) {
				var newName = 'Settler' + Game.time;
				var creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);

				if (creepBody !== null) {
					spawn.spawnCreep(creepBody, newName,
						{memory: {role: 'worker', room: target.name}});
				}
			}
		}
	},

	needsGuard: function(room, guards) {
		var hostiles = room.find(FIND_HOSTILE_CREEPS);
		var guardPartNum = 0;
		var hostilePartNum = 0;

		for(hostile of hostiles) {
			hostilePartNum += hostile.body.length;
		}
		for(guard of guards) {
			guardPartNum += guard.body.length;
		}

		return guardPartNum < hostilePartNum;
		
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
