const config = require('./scripts/config/typedoc.js');

config["external-modulemap"] = ".*packages\/(@sfx\/[^\/]*)\/.*";

module.exports = config;
