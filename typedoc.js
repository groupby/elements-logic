const config = require('./scripts/typedoc.js');

config["external-modulemap"] = ".*packages\/(@sfx\/[^\/]*)\/.*";

module.exports = config;
