"use strict";

const WORKER_HARVESTING = 'harvesting';
const WORKER_TRANSFERING = 'transfering';
const WORKER_UPGRADING = 'upgrading';
const WORKER_BUILDING = 'building';
const WORKER_RELOCATING = 'relocating';
const WORKER_TRANSFER_STORAGE = 'transferStorage';


let roleWorker = {

	run: function(creep) {
		this.creep = creep;
		this.checkRoom();
		this.assignTask();
		this.performTask(this.creep.memory.task);
	},

	assignTask: function() {
		if(this.creep.memory.task === WORKER_RELOCATING){
			return;
		}

		if(this.creep.store[RESOURCE_ENERGY] === 0) {
			this.creep.memory.task = WORKER_HARVESTING;
		}
		else if (this.creep.store.getFreeCapacity() === 0) {
			if (this.getEmpty() !== null) {
				this.creep.memory.task = WORKER_TRANSFERING;
			}
			else if (this.getEmptyTower() !== null) {
				this.creep.memory.task = WORKER_TRANSFERING;
			}
			else if (this.creep.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
				this.creep.memory.task = WORKER_BUILDING;
			}
			else if (this.getRepairTarget() !== null) {
				this.creep.memory.task = WORKER_BUILDING;
			}
			else {
				if (this.getEmptyStorage() !== null) {
					let randomNum = Math.floor(Math.random() * 2);
					console.log("Random num: " + randomNum.toString())
					if (randomNum === 1) { this.creep.memory.task = WORKER_TRANSFER_STORAGE; }
					else { this.creep.memory.task = WORKER_UPGRADING; }
				}
				else {
					this.creep.memory.task = WORKER_UPGRADING;
				}
			}
		}
	},

	checkRoom: function() {
		let assignedRoom = this.creep.memory.room;

		if (assignedRoom !== undefined && 
			this.creep.room.name !== assignedRoom) {
			this.creep.memory.task = WORKER_RELOCATING;
		}
		else {
			if(this.creep.memory.task === WORKER_RELOCATING) {
				this.creep.memory.task = WORKER_HARVESTING;
			}
		}
	},

	getEmpty: function() {
		let target = this.getEmptySpawn();
		if (target === null) { target = this.getEmptyContainer(); }
		
		return target
	},

	getEmptySpawn: function() {
		let target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
					structure.room.name === this.creep.room.name;
			}
		});
		return target;
	},

	getEmptyContainer: function() {
		let target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_CONTAINER &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
					structure.room.name == this.creep.room.name;
			}
		});
		return target;	
	},

	getEmptyStorage: function() {
		let target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_STORAGE &&
					structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
					structure.room.name === this.creep.room.name;
			}
		});
		return target;
	},

	getRepairTarget: function() {
		let repairTarget = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (t) => {
				return t.structureType !== STRUCTURE_WALL && (t.hits < t.hitsMax);			
			}
		});
		return repairTarget;
	},

	getEmptyTower: function() {
		let tower = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: (t) => {
				return t.structureType === STRUCTURE_TOWER &&
					t.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			}
		});
		return tower;
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

			case WORKER_RELOCATING:
				this.relocate();
				break;

			case WORKER_TRANSFER_STORAGE:
				this.transferStorage();
				break;
		}
	},

	harvest: function() {
		let source = null;
		if(this.getEmptySpawn() !== null) {
			source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType === STRUCTURE_CONTAINER ||
						structure.structureType === STRUCTURE_STORAGE) &&
						structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
						structure.room.name === this.creep.room.name;
				}
			});
			if (source !== null) {
				if(this.creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, maxRooms: 1});
				}
				return;
			}
		}
		source = this.creep.pos.findClosestByPath(FIND_SOURCES, {
			filter: (source) => {
				return (source.energy > 0 && source.room.name === this.creep.room.name);
			}
		});
		if(source !== null && this.creep.harvest(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, maxRooms: 1});
		}
		else if (source === null) {
			this.creep.memory.task = WORKER_TRANSFERING;
		}
	},

	transfer: function() {
		let target = this.getEmpty();
		if (target !== null) {
			if(this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
			return;
		}
		target = this.getEmptyTower();
		if (target !== null) {
			if(this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
			return;
		}
		this.creep.memory.task = WORKER_UPGRADING;
	},

	transferStorage: function() {
		let target = this.getEmptyStorage();
		if (target !== null) {
			if(this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStye: {stroke: '#ffffff'}, maxRooms: 1});
			}
			return;
		}
		this.creep.memory.task = WORKER_UPGRADING;
	},

	upgrade: function() {
		if(this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
		}
	},

	build: function() {
		let target = this.getRepairTarget();

		if (target) {
			if(this.creep.repair(target) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
			}
		}
		else {
			target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			
			if(target) {
				if(this.creep.build(target) === ERR_NOT_IN_RANGE) {
					this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
				}
			}
			else {
				this.creep.memory.task = WORKER_UPGRADING;
			}
		}
	},

	relocate: function() {
		let target = this.creep.memory.room;

		let exits = this.creep.room.find(this.creep.room.findExitTo(target));
		let nearestExit = this.creep.pos.findClosestByPath(exits);

		this.creep.moveTo(nearestExit, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
	}
};

module.exports = roleWorker;
