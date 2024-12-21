
var spawnStorageConstructor = {
	
	run: function(spawn) {
		var x = spawn.pos.x - 1;
		var y = spawn.pos.y - 1;
		
		this.buildContainer(x, y);

		x = spawn.pos.x - 1;
		y = spawn.pos.y + 1;

		this.buildContainer(x, y);	
	},

	buildContainer: function(x, y) {
		var hasStorage = spawn.room.lookForAt(LOOK_STRUCTURES, x, y).length !== 0;
		if (!hasStorage) {
			spawn.room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
		}
	}
};

module.exports = spawnStorageConstructor;
