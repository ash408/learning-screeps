
var spawnStorageConstructor = {
	
	run: function(spawn) {
		var x = spawn.pos.x - 1;
		var y = spawn.pos.y - 1;
		
		var hasStorage = spawn.room.lookForAt(LOOK_STRUCTURES, x, y).length !== 0;
		if (!hasStorage) {
			spawn.room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
		}
	}
};

module.exports = spawnStorageConstructor;
