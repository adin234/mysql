var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('127.0.0.1', 3306, 'Openovatelabs1234', 'root', '');

describe('MySQL INSERT Test Suite', function() {
	describe('Functional Tests', function() {
		it('should generate insert statements', function() {
			var query = database.insert('user')
				.set('user_name', 'chris')
				.set('user_age', 21)
				.getQuery();

			assert.equal('INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21);', query);

			query = database.insert('user')
				.set({user_name: 'chris', user_age: 21})
				.getQuery();

			assert.equal('INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21);', query);

			query = database.insert('user')
				.set('user_name', 'chris', 0)
				.set('user_age', 21, 0)
				.set('user_name', '?', 1)
				.set('user_age', 22, 1)
				.getQuery();

			assert.equal('INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21), (?, 22);', query);

			query = database.insert('user')
				.set({user_name: 'chris', user_age: 21})
				.set({user_name: 'dan', user_age: 22}, 1)
				.getQuery();

			assert.equal('INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21), (\'dan\', 22);', query);
		});
	});
});
