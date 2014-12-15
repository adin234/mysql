var assert = require('assert');
var mysql = require('../mysql');
var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root','Openovatelabs1234');

describe('MySQL Collection Test Suite', function() {
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
		
		it('should save(insert and update) and remove using collection', function(done) {
			database.collection('eden_user')
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
			database.collection('eden_user')
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
