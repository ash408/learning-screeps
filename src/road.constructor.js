
const PATH_FINDING_OPTS = { ignoreCreeps: true,
					   plainCost: 1,
					   swampCost: 1};

var roadConstructor = {

	run: function(room) {
		var poiCoordinates = this.findAllPOI(room);
		var roadCoordinates = this.calculateRoads(room, poiCoordinates);
		
		this.buildRoads(room, roadCoordinates);
		Memory.hasRoads[room.name] = true;
	},

	findAllPOI: function(room) {
		var allPOI = []

		var sources = room.find(FIND_SOURCES);
		for (var source in sources) {
			var pos = source.pos;
			pos.roomName = room.name;
			allPOI.push(pos);
		}

		var controller = room.controller.pos;
		allPOI.push(controller);

		return allPOI;
	},

	calculateRoads: function(room, poiCoordinates) {
		var roadCoordinates = [];

		for (var poi of poiCoordinates) {
			var pathCoordinates = this.findSpawnConnection(room, poi);
			roadCoordinates = [...roadCoordinates, ...pathCoordinates];
		}
		return roadCoordinates;
	},

	findSpawnConnection: function(room, pos) {
		var spawn = room.find(FIND_MY_SPAWNS)[0];

		var target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_ROAD;
			}
		});

		if (target) {
			return room.findPath(pos, target.pos, PATH_FINDING_OPTS);
		}
	},

	buildRoads: function(room, roadCoordinates) {

		for (var coordinate of roadCoordinates) {
			room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
		}
	}
};

module.exports = roadConstructor;
