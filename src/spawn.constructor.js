
var spawnConstructor = {

	run: function(spawn) {
		spawnX = spawn.pos.x;
		spawnY = spawn.pos.y;

		var coordinates = [	{x: spawnX - 1, y: spawnY},
						{x: spawnX + 1, y: spawnY},
						{x: spawnX, y: spawnY - 1},
						{x: spawnX, y: spawnY + 1} ]

		for (var coordinate of coordinates) {
			var hasRoad = spawn.room.loofForAt(LOOK_STRUCTURES, coordinate.x, coordinate.y).length !== 0;
			
			if (!hasRoad) {
				spawn.room.createConstructionSite(coordinate.x, coordinate.y, STRUCTURE_ROAD);
			}
		}
	}
};

module.exports spawnConstructor;
