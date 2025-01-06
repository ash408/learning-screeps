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
				if (towers.length > 0) {
					console.log("Defense found in expansion target!");
					console.log("Stopping expansion...");
					Memory.expansion = false;

					global.createRoads(targetRoom);
				}
				else if (this.checkClaim(targetRoom)) {
					let spawn = startRoom.find(FIND_MY_SPAWNS)[0];
					spawnController.spawnSettler(spawn, targetRoom);
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
