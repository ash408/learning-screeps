
var spawnConstructor = {

	run: function(spawn) {
		spawnX = spawn.pos.x;
		spawnY = spawn.pos.y;

		var coordinates = [	{x: spawnX - 1, y: spawnY},
						{x: spawnX + 1, y: spawnY},
						{x: spawnX, y: spawnY - 1},
						{x: spawnX, y: spawnY + 1} ]

		for (var coordinate of coordinates) {
			var hasRoad = spawn.room.lookForAt(LOOK_STRUCTURES, coordinate.x, coordinate.y).length !== 0;
			var hasSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
			
			if (!hasRoad && !hasSites) {
				spawn.room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
			}
		}
	}
};

module.exports = spawnConstructor;
