"use strict";


let colonyCheck = {

	run: function() {
		if (Memory.expansion === false) {
			let roomHash = Game.rooms
			let allRooms = Object.keys(roomHash).map(function(v) { return roomHash[v];});
			let numClaimed = this.getNumClaimed(allRooms);

			for(let room of allRooms) {

				let roomController = room.controller;

				if(roomController !== undefined && roomController.my && roomController.level >= 4 && numClaimed < 5) {
					let adjacentRooms = this.getAdjacentRooms(room);

					for (let adjacentRoom of adjacentRooms) {

						if (this.validateClaimable(adjacentRoom)) {
							console.log("Claiming room " + adjacentRoom.name + " from " + room.name);
							global.startExpansion(room.name, adjacentRoom.name);
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

		console.log("Num of rooms claimed: " + numClaimed.toString());
		return numClaimed;
	},

	validateClaimable: function(room) {
		let isClaimable = false;

		let roomController = room.controller;
		console.log("Room controller owner is: " + room.controller.owner);
		if(roomController !== undefined && !roomController.my &&
			roomController.reservation === undefined &&
			roomController.owner === undefined) {

			console.log("Room " + room.name + " is claimable!");
			isClaimable = true;
			
		}
		return isClaimable;
	},

	getAdjacentRooms: function(room) {
		let adjacentRoomHash = Game.map.describeExits(room.name);
		let adjacentRoomNames = Object.keys(adjacentRoomHash).map(function(v) { return adjacentRoomHash[v];});
		let adjacentRooms = [];
		console.log("Adjacent names: " + adjacentRoomNames);		

		for (let room of adjacentRoomNames) {
			let allRooms = Game.rooms;
			console.log("Checking room: " + room);
			if (room in allRooms) { adjacentRooms.push(allRooms[room]); }
		}
		console.log("Visible rooms: " + adjacentRooms)
		return adjacentRooms;
	}
};

module.exports = colonyCheck;
