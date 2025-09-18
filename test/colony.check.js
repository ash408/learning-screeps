"use strict";


let colonyCheck = {

	run: function() {
		if (Memory.expansion === false) {
			let roomHash = Game.rooms
			let allRooms = Object.keys(roomHash).map(function(v) { return roomHash[v];});
			let numClaimed = this.getNumClaimed(allRooms);

			for(let room of allRooms) {

				let roomController = room.controller;

				if(roomController !== undefined && roomController.my && roomController.level >= 3 && numClaimed < 5) {
					let adjacentRooms = this.getAdjacentRooms(room);

					for (let adjacentRoom of adjacentRooms) {

						if (validateClaimable(adjacentRoom)) {
							console.log("Claiming room " + adjacentRoom.name + " from " + room.name);
							//global.startExpansion(room.name, adjacentRoom.name);
						}		
					}
				}
			}
		}
	},

	getNumClaimed: function(allRooms) {
		let numClaimed = 0;
		
		for (let room of allRooms) {
			let roomController = room.controller;

			if (roomController!== undefined && roomController.my) {
				numClaimed++;
			}
		}

		console.log("Num of rooms claimed: " + str(numClaimed));
		return numClaimed;
	},

	validateClaimable: function(room) {
		let isClaimable = false;

		let roomController = room.controller;
		if(roomController !== undefined && !roomController.my &&
			roomController.reservation === undefined &&
			roomController.owner === "") {
			isClaimable = true;
			
		}
		return isClaimable;
	},

	getAdjacentRooms: function(room) {
	}
};

module.exports = colonyCheck;
