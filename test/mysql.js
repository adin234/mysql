var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('localhost', 'blog', 'root');

describe('MySQL Test Suite', function() {
	describe('Functional Tests', function() {
		it('should insert a new row', function(done) {
			database.insertRow('user', {
				user_name: 'bob',
				user_email: 'bob@gmail.com',
				user_facebook: 123
			}, function(error, row) {
				assert.equal(true, row.insertId > 1);
				done();
			});
		});
		
		it('should insert new rows', function(done) {
			database.insertRows('user', [{
				user_name: 'bob',
				user_email: 'bob@gmail.com',
				user_facebook: 123
			}, {
				user_name: 'chris',
				user_email: 'bob@gmail.com',
				user_facebook: 312
			}], function(error, row) {
				assert.equal(true, row.insertId > 1);
				done();
			});
		});
		
		
		it('should update rows', function(done) {
			database.updateRows('user', {
				user_name: 'bobby'
			}, [['user_email = ?', 'bob@gmail.com']], function(error, row) {
				assert.equal(true, typeof row === 'object');
				done();
			});
		});
		
		it('should get a simple response', function(done) {
			database.query('SELECT * FROM user', function(error, rows) {
				assert(true, rows.length > 0)
				done();
			});
		});
		
		it('should get a row', function(done) {
			database.getRow('user', 'user_email', 'bob@gmail.com', function(error, row) {
				assert.equal('bobby', row.user_name);
				done();
			});
		});
		
		it('should not get a row', function(done) {
			database.getRow('user', 'user_email', 'dayle@gmail.com', function(error, row) {
				assert.equal(null, row);
				done();
			});
		});
		
		it('should remove rows', function(done) {
			database.removeRows('user', 
			[['user_email = ?', 'bob@gmail.com']], 
			function(error, row) {
				assert.equal(true, typeof row === 'object');
				done();
			});
		});
	});
});