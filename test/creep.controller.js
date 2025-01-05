"use strict";

let roleWorker = require('role.worker');
let roleUpgrader = require('role.upgrader');
let roleGuard = require('role.guard');
let roleClaimer = require('role.claimer');


let creepController = {

	run: function() {

		for (let name in Game.creeps) {
			let creep = Game.creeps[name];

			if(creep.memory.role === 'worker') {
				roleWorker.run(creep);
			}
			else if (creep.memory.role === 'guard') {
				roleGuard.run(creep);
			}
			else if (creep.memory.role === 'upgrader') {
				roleUpgrader.run(creep);
			else if (creep.memory.role === 'claimer') {
				roleClaimer.run(creep);
			}
		}
	},
};

module.exports = creepController;
