var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('localhost', 3306, 'blog', 'root');

describe('MySQL Search Test Suite', function() {
	describe('Functional Tests', function() {
		it('should get rows', function(done) {
			database.search('user').getRows(function(error, rows) {
				assert.equal('number', typeof rows.length);
				done();
			});
		});
		
		it('should get row', function(done) {
			database.search('user')
			.addFilter('user_name = ?', 'Christian Blanquera')
			.getRow(function(error, row, meta) {
				assert.equal('cblanquera@gmail.com', row.user_email);
				
				done();
			});
		});
		
		it('should get rows with joins', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.getRows(function(error, rows) {
				assert.equal('number', typeof rows.length);
				done();
			});
		});
		
		it('should get rows with magic', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.getRow(function(error, row, meta) {
				assert.equal('cblanquera@gmail.com', row.user_email);
				done();
			});
		});
		
		it('should get rows with magic sorting', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getRows(function(error, rows, meta) {
				assert.equal('number', typeof rows.length);
				done();
			});
		});
		
		it('should get collection', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getCollection(function(error, collection, meta) {
				assert.equal('Christian Blanquera', collection[0].getUserName());
				done();
			});
		});
		
		it('should get collection modify and save', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getCollection(function(error, collection, meta) {
				collection.setUserFacebook(321).save(function(error, collection, meta) {
					assert.equal(321, collection[0].getUserFacebook());
					done();	
				});
			});
		});
		
		it('should get model', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getModel(function(error, model, meta) {
				assert.equal('Christian Blanquera', model.getUserName());
				done();
			});
		});
		
		it('should get model modify and save', function(done) {
			database.search('post')
			.innerJoinOn('user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getModel(function(error, model, meta) {
				model.setUserFacebook(10204676425696496).save(function(error, collection, meta) {
					assert.equal(10204676425696496, model.getUserFacebook());
					done();	
				});
			});
		});
	});
});