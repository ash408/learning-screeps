
var roadConstructor = {

	run: function(room) {
		var poiCoordinates = this.findAllPOI(room);
		var roadCoordinates = this.calculateRoads(room, poiCoordinates);
		this.buildRoads(room, roadCoordinates);
	},

	findAllPOI: function(room) {
		var allPOI = [];
		
		var sources = room.find(FIND_SOURCES);
		var spawns = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_SPAWN;
			}
		});
		var controller = room.controller.pos;

		allPOI = this.concatArrays(sources, spawns);
		allPOI.push(controller);

		return allPOI;
	},

	calculateRoads: function(room, poiCoordinates) {
		var roadCoordinates = [];
		var pathFindingOpts = {ignoreCreeps: true,
						   plainCost: 0,
						   swampCost: 0};

		for (var poi of poiCoordinates) {
			var connectionCoordinates = poiCoordinates.slice(0);

			for (connection of connectionCoordinates) {
				if (poi.x === connection.x && poi.y === connection.y) {
					continue;
				}
				else {
					var pathCoordinates = room.findPath(poi, connection, pathFindingOpts);
					roadCoordinates = [...roadCoordinates, ...pathCoordinates];
				}
			}
		}
		return roadCoordinates;
	},

	buildRoads: function(room, roadCoordinates) {

		for (var coordinate of roadCoordinates) {
			room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
		}
	},

	concatArrays: function(arr1, arr2) {
		var fullArray = [];
	
		for (var object of arr1) {
			fullArray.push(object.pos);
		}
		for (var object of arr2) {
			fullArray.push(object.pos);
		}
		return fullArray;
	}
};

module.exports = roadConstructor;
