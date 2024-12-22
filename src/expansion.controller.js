var spawnController = require('spawn.controller');


var expansionController = {

	run: function() {
		if (Memory.expansion === true) {
			var startRoom = Game.rooms[Memory.startExpansionRoom];
			var targetRoom = Game.rooms[Memory.expansionTarget];
			
			if (targetRoom !== undefined && startRoom !== undefined) {
				console.log('Rooms defined');
				var spawns = targetRoom.find(FIND_MY_SPAWNS);
				if (spawns.length > 0) {
					console.log("Spawn found in expansion target!");
					console.log("Stopping expansion...");
					Memory.expansion = false;	
				}
				else if (this.checkClaim(targetRoom)) {
					console.log('Spawning Settler');
					var spawn = startRoom.find(FIND_MY_SPAWNS)[0];
					spawnController.spawnSettler(spawn, targetRoom);
				}
			}
			if (startRoom !== undefined) {
				if (!this.checkClaim(targetRoom)) {

					var spawn = startRoom.find(FIND_MY_SPAWNS)[0];
					spawnController.spawnClaimer(spawn);
				}
			}
			else {
				console.log("ERROR: starting room for expansion not found!");
				console.log("Stopping expansion...");
				Memory.expansion = false;
			}
		}
	},

	checkClaim: function(room) {
		isClaimed = false;
		
		if (room !== undefined) {
			isClaimed = room.my;
		}
		return isClaimed;
	}
};

module.exports = expansionController;
