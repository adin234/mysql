var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('localhost', 'blog', 'root');

describe('MySQL SELECT Test Suite', function() {
	describe('Functional Tests', function() {
		it('should generate select statements', function() {
			var query = database.select('*')
				.from('user')
				.innerJoin('post', 'post_user=user_id', false)
				.where('user_name = ?')
				.sortBy('user_name')
				.groupBy('user_id')
				.limit(1, 2)
				.getQuery();
			
			assert.equal('SELECT * FROM user INNER JOIN post ON (post_user=user_id) '
			+ 'WHERE user_name = ? GROUP BY user_id ORDER BY user_name ASC LIMIT 1,2;', query);
			
			query = database.select('*')
				.from('user')
				.leftJoin('post', 'post_user=user_id', false)
				.where('user_name = ?')
				.sortBy('user_name', 'DESC')
				.groupBy('user_id')
				.limit(1, 2)
				.getQuery();
			
			assert.equal('SELECT * FROM user LEFT JOIN post ON (post_user=user_id) '
			+ 'WHERE user_name = ? GROUP BY user_id ORDER BY user_name DESC LIMIT 1,2;', query);
			
			query = database.select('*')
				.from('user')
				.rightJoin('post', 'post_user=user_id', false)
				.where('user_name = ?')
				.sortBy('user_name')
				.getQuery();
			
			assert.equal('SELECT * FROM user RIGHT JOIN post ON (post_user=user_id) '
			+ 'WHERE user_name = ? ORDER BY user_name ASC;', query);
			
			query = database.select('*')
				.from('user')
				.outerJoin('post', 'post_user')
				.where('user_name = ?')
				.groupBy('user_id')
				.limit(1, 2)
				.getQuery();
			
			assert.equal('SELECT * FROM user OUTER JOIN post USING (post_user) '
			+ 'WHERE user_name = ? GROUP BY user_id LIMIT 1,2;', query);
		});
	});
});