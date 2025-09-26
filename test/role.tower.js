"use strict";


let roleTower = {

	run: function(tower) {
		let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		let injured = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter:(c) => {
				return c.hits < c.hitsMax;
			}
		});

		if (target !== undefined) {
			tower.attack(target);
		}
		else if (injured !== undefined) {
			tower.heal(injured);
		}
		
		console.log(target);
		console.log(injured);
		console.log(tower.store.getUsedCapacity().toString())	
		if (target === undefined && injured === undefined &&
			tower.store.getUsedCapacity() >= 750) {
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
