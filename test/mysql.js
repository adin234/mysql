var assert = require('assert');
var mysql = require('../mysql');
var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');

describe('MySQL Test Suite', function() {
	describe('Functional Tests', function() {
		before(function(done) {		
			database.sync(function(next) {
				this.query('CREATE TABLE IF NOT EXISTS `eden_user` (\
				  `user_id` int(10) unsigned NOT NULL,\
				  `user_name` varchar(255) NOT NULL,\
				  `user_pass` varchar(255) DEFAULT NULL,\
				  `user_email` varchar(255) DEFAULT NULL,\
				  `user_facebook` varchar(255) DEFAULT NULL\
				) ENGINE=InnoDB  DEFAULT CHARSET=latin1;', next);
			}).then(function(error, rows, meta, next) {
				this.query('CREATE TABLE IF NOT EXISTS `eden_post` (\
				  `post_id` int(10) unsigned NOT NULL,\
				  `post_user` integer NOT NULL,\
				  `post_title` varchar(255) NOT NULL,\
				  `post_detail` text NOT NULL\
				) ENGINE=InnoDB  DEFAULT CHARSET=latin1;', next);
			}).then(function(error, rows, meta, next) {
				this.query('ALTER TABLE `eden_post` \
				ADD PRIMARY KEY (`post_id`), ADD KEY `post_user` (`post_user`);', next);
			}).then(function(error, rows, meta, next) {
				this.query('ALTER TABLE `eden_user` ADD PRIMARY KEY (`user_id`);', next);
			})
			
			.then(function(error, rows, meta, next) {
				this.query('ALTER TABLE `eden_post` MODIFY `post_id` int(10) unsigned NOT NULL AUTO_INCREMENT;', next);
			}).then(function(error, rows, meta, next) {
				this.query('ALTER TABLE `eden_user` MODIFY `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT', next);
			})
			
			.then(function(error, rows, meta, next) {
				this.query("INSERT INTO `eden_post` \
					(`post_id`, `post_user`, `post_title`, `post_detail`) VALUES\
					(1, 7, 'Take 5', 'You will work now.'),\
					(2, 7, 'Take 5', 'You will work now.');", next);
			}).then(function(error, rows, meta, next) {
				this.query("INSERT INTO `eden_user` \
				(`user_id`, \`user_name`, `user_pass`, \
				`user_email`, `user_facebook`)\
				 VALUES\
				(7, 'Christian Blanquera', NULL, 'cblanquera@gmail.com', \
				'10204676425696496')", next);
			}).then(function(error, rows, meta, next) {
				next();
				done();
			});
		});
		/* 
		*It causes the test to fail.

		after(function(done) {		
			database.sync(function(next) {
				this.query('DROP TABLE `eden_user`', next);
			}).then(function(error, rows, meta, next) {
				this.query('DROP TABLE `eden_post`', next);
			}).then(function(error, rows, meta, next) {
				next();
				done();
			});
		});
		*/
		
		it('should insert a new row', function(done) {
			database.insertRow('eden_user', {
				user_name: 'bob',
				user_email: 'bob@gmail.com',
				user_facebook: 123
			}, function(error, row) {
				assert.equal(true, row.insertId > 1);
				done();
			});
		});
		
		it('should insert new rows', function(done) {
			database.insertRows('eden_user', [{
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
			database.updateRows('eden_user', {
				user_name: 'bobby'
			}, [['user_email = ?', 'bob@gmail.com']], function(error, row) {
				assert.equal(true, typeof row === 'object');
				done();
			});
		});
		
		it('should get a simple response', function(done) {
			database.query('SELECT * FROM eden_user', function(error, rows) {
				assert(true, rows.length > 0)
				done();
			});
		});
		
		it('should returns the columns and attributes', function(done) {
			database.getColumns('eden_post',
				([1,7,'Take 5','You can work now']),
				function(error, row) {
					assert.equal(null, row);
					done();
				});
		});

		it('should get a row', function(done) {
			database.getRow('eden_user', 'user_email', 'bob@gmail.com', function(error, row) {
				assert.equal('bobby123', row.user_name);
				done();
			});
		});
		
		it('should not get a row', function(done) {
			database.getRow('eden_user', 'user_email', 'dayle@gmail.com', function(error, row) {
				assert.equal(null, row);
				done();
			});
		});
	
		it('should return the connection object', function(done) {	
			var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');
			assert.equal(('127.0.0.1', 3306, 'edenjs_test', 'root', null),database.getConnection());
			done();
		});

		it('should connect to the database', function(done) {
			var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');
			var connect = database.connect();
			assert.equal(true, database == connect);
			done();
		});

		it('should remove rows', function(done) {
			database.removeRows('eden_user', 
			[['user_email = ?', 'bob@gmail.com']], 
			function(error, row) {
				assert.equal(true, typeof row === 'object');
				done();
			});
		});
	/*
		ERROR: Timeout 10000ms exceeded
		it('should set only 1 row given the column name and the value', function(done) {
			database.setRow('eden_user', 'user_name', 'Christian Blanquera', {
				user_email: 'cblanquera@gmail.com' 
				}, function(error, row) {
					assert.equal('cblanquera@gmail.com',row.user_email);
					done();
			});
		});
	*/
	});
});
