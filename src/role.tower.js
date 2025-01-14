"use strict";


let roleTower = {

	run: function(tower) {
		let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		let injured = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter:(c) => {
				return c.hits < c.hitsMax;
			}
		});

		if (target !== null) {
			tower.attack(target);
		}
		else if (injured !== null) {
			tower.heal(injured);
		}
	}
};

module.exports = roleTower;
