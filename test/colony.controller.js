"use strict";

let spawnController = require('spawn.controller');
let constructionController = require('construction.controller');

let roleTower = require('role.tower');


let colonyController = {
	
	run: function() {
		let spawnHash = Game.spawns;
		let spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });

		for (let spawn of spawns) {
			spawnController.run(spawn);

			let towers = spawn.room.find(FIND_MY_STRUCTURES, {
				filter:(t) => {
					return t.structureType == STRUCTURE_TOWER &&
						t.store.getCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			for (let tower of towers) {
				roleTower.run(tower);
			}

			constructionController.run(spawn);

			if(spawn.spawning) {
				let spawningCreep = Game.creeps[spawn.spawning.name];
				spawn.room.visual.text(
					'+ ' + spawningCreep.memory.role,
					spawn.pos.x + 1,
					spawn.pos.y,
					{align: 'left', opacity: 0.8});
			}
		}
	}
};

module.exports = colonyController;
