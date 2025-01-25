"use strict";


let roleClaimer = {

	run: function(creep) {
		if (creep.room.name !== Memory.expansionTarget) {
			let exits = creep.room.find(creep.room.findExitTo(Memory.expansionTarget));
			creep.moveTo(exits[0], {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
		}
		else {
			let response = creep.claimController(creep.room.controller);

			if(response === ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
			else {
				console.log('Room ' + Memory.expansionTarget + ' claimed');
				creep.suicide(); // :(
			}
		}
	}
};

module.exports = roleClaimer;
