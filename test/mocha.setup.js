// Don't silently swallow unhandled rejections
process.on('unhandledRejection', (e) => {
    throw e;
});

// Enable the should interface and optional chai plugins if they are installed.
// Some test scaffolds include these packages, but they are not always available
// in minimal adapter setups. Loading them only when present keeps the test suite
// portable across ioBroker template versions and CI environments.
try {
    const { should, use } = require('chai');

    should();

    try {
        use(require('sinon-chai'));
    } catch {
        // Optional plugin not installed.
    }

    try {
        use(require('chai-as-promised'));
    } catch {
        // Optional plugin not installed.
    }
} catch {
    // If chai is ever unavailable, let the test runner fail normally.
}
