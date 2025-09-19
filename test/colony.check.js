"use strict";

let roadConstructor = require('road.constructor');
let spawnConstructor = require('spawn.constructor');


let colonyCheck = {

	run: function() {
		let roomHash = Game.rooms
		let allRooms = Object.keys(roomHash).map(function(v) { return roomHash[v];});
		let claimed = this.getClaimed(allRooms);
		
		if (Memory.expansion === false) {
			this.expansionCheck(claimed);
		}
		this.rebuildCheck(claimed);
	},

	expansionCheck: function(claimed) {
		for(let room of claimed) {

			let roomController = room.controller;

			if(roomController.level >= 4 && claimed.length < 5) {
				let adjacentRooms = this.getAdjacentRooms(room);

				for (let adjacentRoom of adjacentRooms) {

					if (this.validateClaimable(adjacentRoom)) {
						console.log("Claiming room " + adjacentRoom.name + " from " + room.name);
						global.startExpansion(room.name, adjacentRoom.name);
					}		
				}
			}
		}
	},

	rebuildCheck: function(claimed) {
		for (let room of claimed) {
			let numSpawns = room.find(FIND_MY_SPAWNS).length;
			let numConstruction = room.find(FIND_MY_CONSTRUCTION_SITES).length;
			let rcl = room.controller.level;

			if (numSpawns === 0 && numConstruction === 0) {
				spawnConstructor.buildSpawn(room);
			}
			else if (numSpawns !== 0 && rcl > 3 && numConstruction === 0) {
				roadConstructor.run(room);
			}
		}
	},

	getClaimed: function(allRooms) {
		let claimed = [];
		
		for (let room of allRooms) {
			let roomController = room.controller;

			if (roomController!== undefined && roomController.my) {
				claimed.push(room);
			}
		}

		console.log("Num of rooms claimed: " + claimed.length.toString());
		return claimed;
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
