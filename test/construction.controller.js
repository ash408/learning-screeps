"use strict";

let extensionConstructor = require('spawn.extension.constructor');
let spawnStorageConstructor = require('spawn.storage.constructor');
let spawnDefenseConstructor = require('spawn.defense.constructor');
let spawnConstructor = require('spawn.constructor');

let roadConstructor = require('road.constructor');


let constructionController = {

	run: function(spawn) {

		let response = extensionConstructor.run(spawn);

		if (response !== OK) {
			spawnStorageConstructor.run(spawn);
			spawnDefenseConstructor.run(spawn);
			spawnConstructor.run(spawn);
		}

		let constructionSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
		if (Memory.hasRoads[spawn.room.name] !== undefined &&
			Game.cpu.bucket === 10000 && constructionSites.length === 0) {
				
				roadConstructor.run(spawn.room);
		}
	}
};

module.exports = constructionController;
