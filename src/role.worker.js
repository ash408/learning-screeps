const WORKER_HARVESTING = 'harvesting';
const WORKER_TRANSFERING = 'transfering';
const WORKER_UPGRADING = 'upgrading';
const WORKER_BUILDING = 'building';


var roleWorker = {

	run: function(creep) {
		this.creep = creep;
		this.assignTask();
		this.performTask(this.creep.memory.task);
	},

	assignTask: function() {
		if(this.creep.store[RESOURCE_ENERGY] === 0) {
			this.creep.memory.task = WORKER_HARVESTING;
		}
		else if (this.creep.store.getFreeCapacity() === 0) {
			if (this.getEmptyStore() !== null) {
				this.creep.memory.task = WORKER_TRANSFERING;
			}
			else if (this.creep.room.find(FIND_CONSTRUCTION_SITES).length ||
					this.getRepairTarget !== null) {
				this.creep.memory.task = WORKER_BUILDING;
			}
			else if (this.getEmptyTower()) {
				this.creep.memeory.task = WORKER_TRANSFERING;
			}
			else {
				this.creep.memory.task = WORKER_UPGRADING;
			}
		}
	},

	getEmptyStore: function() {
		var target = this.getEmptySpawn();
		if (target === null) { target = this.getEmptyContainer(); }
		
		return target
	},

	getEmptySpawn: function() {
		var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		return target;
	},

	getEmptyContainer: function() {
		var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_CONTAINER &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		return target;	
	},

	getRepairTarget: function() {
		var repairTarget = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: (t) => {
				return (t.hits < t.maxHits);			
			}
		});
		return repairTarget;
	},

	getEmptyTower: function() {
		var tower = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: (t) => {
				return t.structureType === STRUCTURE_TOWER &&
					t.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
	},

	performTask: function(task) {
		switch(task) {
			case WORKER_HARVESTING:
				this.harvest();
				break;

			case WORKER_TRANSFERING:
				this.transfer();
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
		var source = null;
		if(this.getEmptySpawn() !== null) {
			source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType === STRUCTURE_CONTAINER &&
						structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			if (source !== null) {
				if(this.creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
				return;
			}
		}
		source = this.creep.pos.findClosestByPath(FIND_SOURCES, {
			filter: (source) => {
				return (source.energy > 0);
			}
		});
		if(source != null && this.creep.harvest(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	},

	transfer: function() {
		var target = this.getEmptyStore();
		if (target !== null) {
			if(this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			return;
		}
		target = this.getEmptyTower();
		if (target !== null) {
			if(this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
			return;
		}
		this.creep.memory.task = WORKER_HARVESTING;
	},

	upgrade: function() {
		if(this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
		}
	},

	build: function() {
		var target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

		if(target) {
			if(this.creep.build(target) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else {
			var repairTarget = this.getRepairTarget();
			if (repairTarget) {
				if(this.creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			else {
				this.creep.memory.task = WORKER_HARVESTING;
			}
		}
	}
};

module.exports = roleWorker;
