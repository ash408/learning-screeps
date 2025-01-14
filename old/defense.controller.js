"use strict";

let roleTower = require('role.tower')


let defenseController = {

	run: function(spawn) {

		this.handleTowers(spawn);
	},

	handleTowers: function(spawn) {

		let towers = spawn.room.find(FIND_MY_STRUCTURES, {
			filter:(t) => {
				return t.structureType === STRUCTURE_TOWER &&
					t.store.getCapacity(RESOURCE_ENERGY) > 0;
			}
		});

		for (let tower of towers) {
			roleTower.run(tower);
		}
	}
};

module.exports = defenseController;
