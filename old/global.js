"use strict";

let roadConstructor = require ('road.constructor');


let globalItems = {
	
	load: function() {

		global.test = function() {
			console.log("globals loaded");
		}

		global.clearSites = function() {
			let spawnHash = Game.spawns;
			let spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });
			let sites = [];

			for (let spawn of spawns){
				let thisSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
				sites = [...sites, ...thisSites];
			}
			for (let site of sites) {
				site.remove();
			}
		}

		global.startExpansion = function(startRoom, expansionTarget) {
			Memory.expansion = true;
			Memory.startExpansionRoom = startRoom;
			Memory.expansionTarget = expansionTarget;
		}

		global.clearWorkers = function() {
			for (let name in Game.creeps) {
				let creep = Game.creeps[name];

				if(creep.memory.role == 'worker') {
					creep.memory.task = 'harvesting';
				}
			}
		}

		global.createRoads = function(roomName) {
			console.log("Building roads in " + roomName);
			let room = Game.rooms[roomName];

			if (room !== undefined) {
				roadConstructor.run(room);
			}
		}
	}
};

module.exports = globalItems;

