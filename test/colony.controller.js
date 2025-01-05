"use strict";

let spawnController = require('spawn.controller');
let defenseController = require('defense.controller');
let constructionController = require('construction.controller');


let colonyController = {
	
	run: function() {
		let spawnHash = Game.spawns;
		let spawns = Object.keys(spawnHash).map(function(v) { return spawnHash[v]; });

		for (let spawn of spawns) {

			spawnController.run(spawn);
			defenseController.run(spawn);
			constructionController.run(spawn);
		}
	}
};

module.exports = colonyController;
