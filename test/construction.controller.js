"use strict";

let extensionConstructor = require('spawn.extension.constructor');


let constructionController = {

	run: function(spawn) {

		let response = extensionConstructor.run(spawn);
	}
};

module.exports = constructionController;
