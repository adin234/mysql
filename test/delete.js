var assert = require('assert');
var mysql = require('../mysql');

var database = require(__dirname + '/database')();

describe('MySQL DELETE Test Suite', function() {
	describe('Functional Tests', function() {
		it('should generate delete statements', function() {
			var query = database
				.remove('user')
				.where('user_id = ?')
				.getQuery();

			assert.equal('DELETE FROM user WHERE user_id = ?;', query);

			query = database
				.remove('user')
				.where(['user_id = ?', 'user_name = ?'])
				.getQuery();

			assert.equal('DELETE FROM user WHERE user_id = ? AND user_name = ?;', query);

			query = database
				.remove('user')
				.where('user_id = ?')
				.where('user_name = ?')
				.getQuery();

			assert.equal('DELETE FROM user WHERE user_id = ? AND user_name = ?;', query);
		});
	});
});
