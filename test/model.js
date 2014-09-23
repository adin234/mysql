var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('localhost', 'blog', 'root');

describe('MySQL Model Test Suite', function() {
	describe('Functional Tests', function() {
		it('should save(insert and update) and remove using model', function(done) {
			database.model('user')
				.setUserName('Bobby')
				.setUserEmail('bobby@gmail.com')
				.setUserFacebook(123)
				.save(function(error, model, meta) {
					assert.equal(null, error);
					model.setUserName('Billy').save(function(error, model, meta) {
						assert.equal(null, error);
						model.remove(function(error, model, meta) {
							assert.equal(null, error);
							done();
						});
						
					});
				});
		});
		
		it('should save(insert and update) and remove using model and sync', function(done) {
			database.model('user')
				.setUserName('Bobby')
				.setUserEmail('bobby@gmail.com')
				.setUserFacebook(123)
				.sync(function(next) {
					this.save(next);
				}).then(function(error, model, meta, next) {
					assert.equal(null, error);
					model.setUserName('Billy').save(next);
				}).then(function(error, model, meta, next) {
					assert.equal(null, error);
					model.remove(next);
				}).then(function(error, model, meta, next) {
					assert.equal(null, error);
					done()
				});
		});
	});
});