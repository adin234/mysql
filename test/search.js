var assert = require('assert');
var mysql = require('../mysql');

var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');

describe('MySQL Search Test Suite', function() {
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
		
		it('should get rows', function(done) {
			database.search('eden_user').getRows(function(error, rows) {
				assert.equal('number', typeof rows.length);
				done();
			});
		});
		
		it('should get row', function(done) {
			database.search('eden_user')
			.addFilter('user_name = ?', 'Christian Blanquera')
			.getRow(function(error, row, meta) {
				assert.equal('cblanquera@gmail.com', row.user_email);
				
				done();
			});
		});
		
		it('should get rows with joins', function(done) {
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
			.getRows(function(error, rows) {
				assert.equal('number', typeof rows.length);
				done();
			});
		});
		
		it('should get rows with magic', function(done) {
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.getRow(function(error, row, meta) {
				assert.equal('cblanquera@gmail.com', row.user_email);
				done();
			});
		});
		
		it('should get rows with magic sorting', function(done) {
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getRows(function(error, rows, meta) {
				assert.equal('number', typeof rows.length);
				done();
			});
		});
		
		it('should get collection', function(done) {
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getCollection(function(error, collection, meta) {
				assert.equal('Christian Blanquera', collection[0].getUserName());
				done();
			});
		});
		
		it('should get collection modify and save', function(done) {
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
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
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
			.filterByUserName('Christian Blanquera')
			.sortByUserId('DESC')
			.getModel(function(error, model, meta) {
				assert.equal('Christian Blanquera', model.getUserName());
				done();
			});
		});
		
		it('should get model modify and save', function(done) {
			database.search('eden_post')
			.innerJoinOn('eden_user', 'post_user=user_id')
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
