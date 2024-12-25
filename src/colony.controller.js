var spawnController = require('spawn.controller');

var extensionConstructor = require('spawn.extension.constructor');
var spawnStorageConstructor = require('spawn.storage.constructor');
var spawnDefenseConstructor = require('spawn.defense.constructor');
var spawnConstructor = require('spawn.constructor');
var roadConstructor = require('road.constructor');

var roleTower = require('role.tower');


var colonyController = {
	
	run: function() {
		var spawnHash = Game.spawns;
		var spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });

		for (var spawn of spawns) {
			console.log("running spawn controller for: " + spawn.name);
			spawnController.run(spawn);

			var towers = spawn.room.find(FIND_MY_STRUCTURES, {
				filter:(t) => {
					return t.structureType == STRUCTURE_TOWER &&
						t.store.getCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			for (var tower of towers) {
				roleTower.run(tower);
			}
			var response = extensionConstructor.run(spawn);

			if (response !== OK) {
				spawnStorageConstructor.run(spawn);
				spawnDefenseConstructor.run(spawn);
				spawnConstructor.run(spawn);
			}
			
			var constructionSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
			if (Memory.hasRoads[spawn.room.name] !== undefined &&
				Game.cpu.bucket === 10000 && constructionSites.length === 0) {
				roadConstructor.run(spawn.room);
			}

			if(spawn.spawning) {
				var spawningCreep = Game.creeps[spawn.spawning.name];
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
