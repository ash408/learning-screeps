
var roleGuard = {

	run: function(creep) {
		var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (target !== null && creep.attack(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		}
	}
};

module.exports = roleGuard;
