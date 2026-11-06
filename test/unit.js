const path = require("path");
const { tests } = require("@iobroker/testing");

// Run unit tests. See https://github.com/ioBroker/testing for details and further
// options.
tests.unit(path.join(__dirname, ".."));
