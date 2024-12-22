var spawnController = require('spawn.controller');


var expansionController = {

	run: function() {
		if (Memory.expansion === true) {
			var startRoom = Game.rooms[Memory.startExpansionRoom];

			if (startRoom !== undefined) {
				var spawn = room.find(FIND_MY_SPAWNS)[0];
				spawnController.spawnClaimer(spawn);
			}
			else {
				console.log("ERROR: starting room for expansion not found!");
				console.log("Stopping expansion...");
				Memory.expansion = false;
			}
		}
	}
};

module.exports = expansionController;
