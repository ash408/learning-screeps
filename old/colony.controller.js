"use strict";

let spawnController = require('spawn.controller');

let extensionConstructor = require('spawn.extension.constructor');
let spawnStorageConstructor = require('spawn.storage.constructor');
let spawnDefenseConstructor = require('spawn.defense.constructor');
let spawnConstructor = require('spawn.constructor');
let roadConstructor = require('road.constructor');

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
			let response = extensionConstructor.run(spawn);
			console.log("Extension construction for " + spawn.name);
			if (response !== OK) {
				spawnStorageConstructor.run(spawn);
				spawnDefenseConstructor.run(spawn);
				spawnConstructor.run(spawn);
			}
			
			let constructionSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
			if (Memory.hasRoads[spawn.room.name] !== undefined &&
				Game.cpu.bucket === 10000 && constructionSites.length === 0) {
				roadConstructor.run(spawn.room);
			}

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
