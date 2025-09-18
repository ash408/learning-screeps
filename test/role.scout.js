"use strict";


let roleScout = {

	run: function(creep) {
		if (creep.room.name === creep.memory.room) {
			let adjacentRoomHash = Game.map.describeExits(creep.room.name);
			let adjacentRoomNames = Object.keys(adjacentRoomHash).map(function(v) {return adjacentRoomHash[v];});

			let randomIndex = Math.floor(Math.random() * adjacentRoomNames.length);
			let exits = creep.room.find(creep.room.findExitTo(adjacentRoomNames[randomIndex]);
			let nearestExit = creep.pos.findClosestByPath(exits);

			creep.moveTo(nearestExit, {visualizePathStyle: {stroke: "#ffffff"}, maxRooms: 1});
		}
	}
};

module.exports = roleScout;
