// --------------------------------------------------
// JEST JAVASCRIPT TESTING
// Run tests via command-line using: 
// 		$ npm t
// 
// Documentation: https://facebook.github.io/jest/
// --------------------------------------------------

const main = require('../main.js');

test('adds 1 + 2 to equal 3', () => {
	expect(main.sum(1, 2)).toBe(3);
})