const config = require('./scripts/config/typedoc.js');

config["external-modulemap"] = ".*packages\/(@groupby\/[^\/]*)\/.*";

module.exports = config;
