const config = require('./scripts/config/typedoc.js');

config["external-modulemap"] = ".*packages\/(@elements\/[^\/]*)\/.*";

module.exports = config;
