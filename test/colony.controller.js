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
		}
	}
};

module.exports = colonyController;
