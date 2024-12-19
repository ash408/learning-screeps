
var spawnDefenseConstructor = {

	run: function(spawn) {
		var x = spawn.pos.x + 1;
		var y = spawn.pos.x + 1;

		var hasTower = spawn.room.lookForAt(LOOK_STRUCTURES, x, y).length !== 0;
		if (!hasTower) {
			spawn.room.createConstructionSite(x, y, STRUCTURE_TOWER);
		}
	}
};

module.exports = spawnDefenseConstructor;
