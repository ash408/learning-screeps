const WORKER_HARVESTING = 'harvesting';
const WORKER_UPGRADING = 'upgrading';
const WORKER_BUILDING = 'building';


var roleWorker = {

	run: function(creep) {
		this.creep = creep;
		this.assignTask();
		this.performTask(creep.memory.task);
	},

	assignTask: function() {
		if(this.creep.store[RESOURCE_ENERGY] === 0) {
			this.creep.memory.task = WORKER_HARVESTING;
		}
		else {
			if (this.creep.room.find(FIND_CONSTRUCTION_SITES).length) {
				this.creep.memory.task = WORKER_BUILDING;
			}
			else {
				this.creep.memory.task = WORKER_UPGRADING;
			}
		}
	},

	performTask: function(task) {
		switch(task) {
			case WORKER_HARVESTING:
				this.harvest();
				break;

			case WORKER_UPGRADING:
				this.upgrade();
				break;

			case WORKER_BUILDING:
				this.build();
				break;
		}
	},

	harvest: function() {
		var source = this.creep.pos.findClosestByPath(FIND_SOURCES);

		if(source != null && this.creep.harvest(source, RESOURCE_ENERGY) === ERR_NOT_IN_RAGE) {
			this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	},

	upgrade: function() {
		if(creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
			creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
		}
	},

	build: function() {
		var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);

		if(targets.length) {
			if(this.creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
};

module.exports = roleWorker;
