"use strict";


let roleGuard = {

	run: function(creep) {
		let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (target !== null && creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		}
	}
};

module.exports = roleGuard;
