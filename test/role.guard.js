"use strict";


let roleGuard = {

	run: function(creep) {
		this.creep = creep;
		let relocate = this.shouldRelocate();

		let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (target !== null && creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
		}

		if (target === null) {
			let enemy_structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
			if (enemy_structure !== null && creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(enemy_structure, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
			else if (enemy_structure === null && relocate) {
				let newRoom = this.creep.memory.room;

				let exits = this.creep.room.find(this.creep.room.findExitTo(newRoom));
				let nearestExit = this.creep.pos.findClosestByPath(exits);

				this.creep.moveTo(nearestExit, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
			else {
				this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
		}
	},

	shouldRelocate: function() {
		let assignedRoom = this.creep.memory.room;

		if (assignedRoom !== undefined &&
			this.creep.room.name !== assignedRoom) {
			
			return true;
		}
		else {
			return false;
		}
	}
};

module.exports = roleGuard;
