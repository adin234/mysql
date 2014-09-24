var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('localhost', 3306, 'blog', 'root');

describe('MySQL Collection Test Suite', function() {
	describe('Functional Tests', function() {
		it('should save(insert and update) and remove using collection', function(done) {
			database.collection('user')
				.add({})
				.add({})
				.setFoo('bar')
				.setUserName('Bobby2')
				.setUserEmail('bobby2@gmail.com')
				.setUserFacebook(123)
				.save(function(errors, collection, meta) {
					assert.equal('bar', collection[0].foo);
					assert.equal('bobby2@gmail.com', collection[1].user_email);
					
					collection.setUserName('Bobby3').save(function(errors, collection, meta) {
						assert.equal('bar', collection[0].foo);
						assert.equal('Bobby3', collection[1].user_name);
						collection.remove(function(errors, collection, meta) {
							assert.equal('bar', collection[0].foo);
							assert.equal('Bobby3', collection[1].user_name);
							done();
						});
					});
				});
		});
		
		it('should save(insert and update) and remove using collection and sync', function(done) {
			database.collection('user')
				.add({})
				.add({})
				.setFoo('bar')
				.setUserName('Bobby2')
				.setUserEmail('bobby2@gmail.com')
				.setUserFacebook(123)
				.sync(function(next) {
					this.save(next);
				}).then(function(errors, collection, meta, next) {
					assert.equal('bar', collection[0].foo);
					assert.equal('bobby2@gmail.com', collection[1].user_email);
					collection.setUserName('Bobby3').save(next);
				}).then(function(errors, collection, meta, next) {
					assert.equal('bar', collection[0].foo, next);
					assert.equal('Bobby3', collection[1].user_name);
					collection.remove(next);
				}).then(function(errors, collection, meta, next) {
					assert.equal('bar', collection[0].foo);
					assert.equal('Bobby3', collection[1].user_name);
					done();
				});
		});
	});
});