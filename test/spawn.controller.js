"use strict";

const MAX_UPGRADERS = 1;
const MAX_SETTLERS = 2;
const MAX_CLAIMERS = 1;

const WORKERS_PER_SOURCE = 2;

const MOVE_COST = 50;
const WORK_COST = 100;
const CARRY_COST = 50;
const ATTACK_COST = 80;
const RANGED_COST = 150;
const TOUGH_COST = 10;
const CLAIM_COST = 600;

const BODY_HASH = {[MOVE]: MOVE_COST, [WORK]: WORK_COST, [CARRY]: CARRY_COST,
				[ATTACK]: ATTACK_COST, [TOUGH]: TOUGH_COST, [CLAIM]: CLAIM_COST,
				[RANGED_ATTACK]: RANGED_COST};

const WORKER_TEMPLATE = [MOVE, CARRY, WORK];
const SETTLER_TEMPLATE = [MOVE, MOVE, MOVE, CARRY, WORK];
const GUARD_TEMPLATE = [MOVE, RANGED_ATTACK];
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
			let newName = 'Upgrader' + Game.time;
			let creepBody = this.calculateBody(spawn.room, WORKER_TEMPLATE);
			
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

		if (spawn.spawning) {
			let spawningCreep = Game.creeps[spawn.spawning.name];
			spawn.room.visual.text(
				'+ ' + spawningCreep.memory.role,
				spawn.pos.x + 1,
				spawn.pos.y + 1,
				{align: 'left', opacity: 0.8});
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
			let creeps = Game.creeps;
			let workers = _.filter(creeps, (creep) => creep.memory.room === target.name);

			if (workers.length < MAX_SETTLERS) {
				let newName = 'Settler' + Game.time;
				let creepBody = this.calculateBody(spawn.room, SETTLER_TEMPLATE);

				if (creepBody !== null) {
					spawn.spawnCreep(creepBody, newName,
						{memory: {role: 'worker', room: target.name}});
				}
			}
		}
	},

	needsGuard: function(room, guards) {
		let hostiles = room.find(FIND_HOSTILE_CREEPS);
		let rcl = room.controller.level;

		if (hostiles.length > 1 || rcl < 3) {
	
			let guardPartNum = 0;
			let hostilePartNum = 0;

			for(let hostile of hostiles) {
				hostilePartNum += hostile.body.length;
			}
			for(let guard of guards) {
				guardPartNum += guard.body.length;
			}

			return guardPartNum < hostilePartNum;
		}
		return false;
	},

	calculateBody: function(room, template) {
		let body = template.slice(0);
		let totalEnergy = room.energyAvailable;

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
		
		return totalEnergy;
	}
};

module.exports = spawnController;
