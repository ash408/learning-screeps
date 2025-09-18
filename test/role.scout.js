"use strict";


let roleScout = {

	run: function(creep) {
		let targetRoom = creep.memory.room;

		if (targetRoom === undefined) {
			let adjacentRoomHash = Game.map.describeExits(creep.room.name);
			let adjacentRoomNames = Object.keys(adjacentRoomHash).map(function(v) {return adjacentRoomHash[v];});

			let randomIndex = Math.floor(Math.random() * adjacentRoomNames.length);
			creep.memory.room = adjacentRoomNames[randomIndex];
	
		}

		if (creep.room.name !== targetRoom) {
			let exits = creep.room.find(creep.room.findExitTo(adjacentRoomNames[randomIndex]));
			let nearestExit = creep.pos.findClosestByPath(exits);

			creep.moveTo(nearestExit, {visualizePathStyle: {stroke: "#ffffff"}, maxRooms: 1});
		}
	}
};

module.exports = roleScout;
