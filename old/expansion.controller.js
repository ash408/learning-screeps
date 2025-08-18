"use strict";

let spawnController = require('spawn.controller');


let expansionController = {

	run: function() {
		if (Memory.expansion === true) {
			let startRoom = Game.rooms[Memory.startExpansionRoom];
			let targetRoom = Game.rooms[Memory.expansionTarget];
			
			if (targetRoom !== undefined && startRoom !== undefined) {
				let towers = targetRoom.find(FIND_MY_STRUCTURES, {
					filter:(t) => {
						return t.structureType === STRUCTURE_TOWER;
					}
				});
				let sites = targetRoom.find(FIND_MY_CONSTRUCTION_SITES);

				if (towers.length > 0 && sites.length === 0) {
					console.log("All construction done at expansion target!");
					console.log("Stopping expansion...");
					Memory.expansion = false;

					global.createRoads(targetRoom.name);
				}
				else if (this.checkClaim(targetRoom)) {
					let spawn = startRoom.find(FIND_MY_SPAWNS)[0];
					spawnController.spawnSettler(spawn, targetRoom);
					spawnController.spawnCleaner(spawn, targetRoom);
				}
				else {	
					let spawn = startRoom.find(FIND_MY_SPAWNS)[0];
					spawnController.spawnCleaner(spawn, targetRoom);
				}
			}
			if (startRoom !== undefined) {
				if (!this.checkClaim(targetRoom)) {

					let spawn = startRoom.find(FIND_MY_SPAWNS)[0];
					spawnController.spawnClaimer(spawn);
				}
			}
			else {
				console.log("ERROR: starting room for expansion not found!");
				console.log("Stopping expansion...");
				Memory.expansion = false;
			}
		}
	},

	checkClaim: function(room) {
		let isClaimed = false;
		
		if (room !== undefined) {
			isClaimed = room.controller.my;
		}
		return isClaimed;
	}
};

module.exports = expansionController;
