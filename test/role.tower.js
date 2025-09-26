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
		
		if (target === null && injured === null &&
			tower.store.getUsedCapacity(RESOURCE_ENERGY) >= 750) {
			let repairTarget = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				filter: (t) => {
					return t.structureType === STRUCTURE_RAMPART &&
						t.hits <= 1000;
				}
			});
			tower.repair(repairTarget);
		}
	}
};

module.exports = roleTower;
