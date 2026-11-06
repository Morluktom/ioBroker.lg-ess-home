const path = require("path");
const { tests } = require("@iobroker/testing");

// Run integration tests. See https://github.com/ioBroker/testing for details
// and further options.
tests.integration(path.join(__dirname, ".."));
