
var roleTower = {

	run: function(tower) {
		var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target !== null) {
			tower.attack(target);
		}
	}
};

module.exports = roleTower;
