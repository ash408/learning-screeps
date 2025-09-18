"use strict";

let roadConstructor = require ('road.constructor');
let spawnConstructor = require('spawn.constructor');
let colonyCheck = require('colony.check');


let globalItems = {
	
	load: function() {

		global.test = function() {
			;
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

		global.stopExpansion = function() {
			Memory.expansion = false;
			Memory.startExpansionRoom = undefined;
			Memory.expansionTarget = undefined;
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

		global.buildSpawn = function(roomName) {
			let room = Game.rooms[roomName];

			if (room !== undefined) {
				spawnConstructor.buildSpawn(room);
			}
			else {
				console.log("Room is undefined");
			}
		}
	}
};

module.exports = globalItems;

