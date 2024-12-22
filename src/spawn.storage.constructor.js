
var spawnStorageConstructor = {
	
	run: function(spawn) {
		var hasExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType === STRUCTURE_EXTENSION;
			}
		}).length > 0;
		var hasSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;

		if (hasExtensions && !hasSites) {
			var x = spawn.pos.x - 1;
			var y = spawn.pos.y - 1;
		
			this.buildContainer(spawn, x, y);

			x = spawn.pos.x - 1;
			y = spawn.pos.y + 1;

			this.buildContainer(spawn, x, y);	
		}
	},

	buildContainer: function(spawn, x, y) {
		var hasStorage = spawn.room.lookForAt(LOOK_STRUCTURES, x, y).length !== 0;
		if (!hasStorage) {
			spawn.room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
		}
	}
};

module.exports = spawnStorageConstructor;
