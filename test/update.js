var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root');

describe('MySQL Update Test Suite', function() {
	describe('Functional Tests', function() {
		it('should generate update statements', function() {
			var query = database.update('user')
				.set('user_name', 'chris')
				.set('user_age', 21)
				.where('user_id = ?')
				.where('user_name = ?')
				.getQuery();
				
			assert.equal('UPDATE user SET user_name = \'chris\', user_age = 21 WHERE user_id = ? AND user_name = ?;', query);
			
			query = database.update('user')
				.set({user_name: 'chris', user_age: 21})
				.where(['user_id = ?', 'user_name = ?'])
				.getQuery();
				
			assert.equal('UPDATE user SET user_name = \'chris\', user_age = 21 WHERE user_id = ? AND user_name = ?;', query);
		
		});
	});
});