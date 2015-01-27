var assert = require('assert');
var mysql = require('../mysql');

var database = require(__dirname + '/database')();

describe('MySQL Model Test Suite', function() {
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

		it('should save(insert and update) and remove using model', function(done) {
			database.model('eden_user')
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
			database.model('eden_user')
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
