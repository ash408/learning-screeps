const UPGRADER_HARVESTING = 'harvesting';
const UPGRADER_UPGRADING = 'upgrading';


var roleUpgrader = {

	run: function(creep) {
		this.creep = creep;
		this.assignTask();
		this.performTask(this.creep.memory.task);
	},

	assignTask: function() {
		if(this.creep.store[RESOURCE_ENERGY] === 0) {
			this.creep.memory.task = UPGRADER_HARVESTING;
		}
		else if (this.creep.store.getFreeCapacity() === 0) {
			this.creep.memory.task = UPGRADER_UPGRADING;
		}
	},

	performTask: function(task) {
		switch(task) {
			case UPGRADER_HARVESTING:
				this.harvest();
				break;
			
			case UPGRADER_UPGRADING:
				this.upgrade();
				break;
		}
	},

	harvest: function() {
		var source = this.creep.pos.findClosestByPath(FIND_SOURCES, {
			filter: (source) => {
				return (source.energy > 0);
			}
		});
		if (source !== null && this.creep.harvest(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	},

	upgrade: function() {
		if(this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
		}
	}
};

module.exports = roleUpgrader;
