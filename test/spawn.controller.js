"use strict";

const MAX_UPGRADERS = 1;
const MAX_SETTLERS = 3;
const MAX_CLAIMERS = 1;

const WORKERS_PER_SOURCE = 2;

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


let spawnController = {
		
	run: function(spawn) {
		let creeps = spawn.room.find(FIND_MY_CREEPS);
		let sources = spawn.room.find(FIND_SOURCES);

		let MAX_WORKERS = sources.length * WORKERS_PER_SOURCE;
	
		let workers = _.filter(creeps, (creep) => creep.memory.role == 'worker');
		let upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
		let guards = _.filter(creeps, (creep) => creep.memory.role == 'guard');
	
		if (this.needsGuard(spawn.room, guards)) {
			let newName = 'Guard' + Game.time;
			let creepBody = this.calculateBody(spawn.room, GUARD_TEMPLATE);

			if (creepBody !== null) {
				spawn.spawnCreep(creepBody, newName,
					{memory: {role: 'guard'}});
			}
		}
		else if (upgraders.length < MAX_UPGRADERS) {
			console.log("Spawn upgrader for " + spawn.name);
			let newName = 'Upgrader' + Game.time;
			let creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);
			
			console.log("Upgrader body: " + creepBody);
			if (creepBody !== null) {
				spawn.spawnCreep(creepBody, newName,
					{memory: {role: 'upgrader'}});
			}
		}
		else if (workers.length < MAX_WORKERS) {
			let newName = 'Worker' + Game.time;
			let creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);

			if (creepBody !== null) {
				spawn.spawnCreep(creepBody, newName,
					{memory: {role: 'worker'}});
			}
		}
	},

	spawnClaimer: function(spawn) {
		if (!spawn.spawning) {
			let claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
			
			if (claimers.length < MAX_CLAIMERS) {
				let newName = 'Claimer' + Game.time;
				let creepBody = this.calculateBody(spawn.room, CLAIMER_TEMPLATE);

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
			let creeps = target.find(FIND_MY_CREEPS);
			let workers = _.filter(creeps, (creep) => creep.memory.role == 'worker');

			if (workers.length < MAX_SETTLERS) {
				let newName = 'Settler' + Game.time;
				let creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);

				if (creepBody !== null) {
					spawn.spawnCreep(creepBody, newName,
						{memory: {role: 'worker', room: target.name}});
				}
			}
		}
	},

	needsGuard: function(room, guards) {
		let hostiles = room.find(FIND_HOSTILE_CREEPS);
		let guardPartNum = 0;
		let hostilePartNum = 0;

		for(let hostile of hostiles) {
			hostilePartNum += hostile.body.length;
		}
		for(let guard of guards) {
			guardPartNum += guard.body.length;
		}

		return guardPartNum < hostilePartNum;
		
	},

	calculateBody: function(room, template) {
		let body = template.slice(0);
		let totalEnergy = room.energyAvailable;
		console.log("Energy in room: " + totalEnergy);

		while (totalEnergy >= this.calculateEnergy(body)){

			for (let part of template){	
				let testBody = body.slice(0);
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
		let totalEnergy = 0;

		for (let part of bodyParts) {
			totalEnergy += BODY_HASH[part];
		}
		console.log("Energy calculated: " + totalEnergy);
		return totalEnergy;
	}
};

module.exports = spawnController;
