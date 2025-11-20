"use strict";


const PATH_FINDING_OPTS = { ignoreCreeps: true,
					   plainCost: 1,
					   swampCost: 1};

let roadConstructor = {

	run: function(room) {
		let poiCoordinates = this.findAllPOI(room);
		let roadCoordinates = this.calculateRoads(room, poiCoordinates);
		
		this.buildRoads(room, roadCoordinates);
	},

	findAllPOI: function(room) {
		let allPOI = []

		let sources = room.find(FIND_SOURCES);
		for (let source of sources) {
			allPOI.push(source.pos);
		}

		let controller = room.controller.pos;
		allPOI.push(controller);

		return allPOI;
	},

	calculateRoads: function(room, poiCoordinates) {
		let roadCoordinates = [];

		for (let poi of poiCoordinates) {
			let pathCoordinates = this.findSpawnConnection(room, poi);
			roadCoordinates = [...roadCoordinates, ...pathCoordinates];
		}
		return roadCoordinates;
	},

	findSpawnConnection: function(room, pos) {
		let spawn = room.find(FIND_MY_SPAWNS)[0];

		let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_ROAD;
			}
		});
		
		if (target) {
			return room.findPath(pos, target.pos, PATH_FINDING_OPTS);
		}
		else {
			console.log("WARNING - No roads in " + room.name +  " for paths to be created, need at least one road around spawn")
		}
	},

	buildRoads: function(room, roadCoordinates) {

		for (let coordinate of roadCoordinates) {
			room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
		}
	}
};

module.exports = roadConstructor;
