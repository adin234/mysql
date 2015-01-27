var mysql = require( __dirname + '/../mysql');


module.exports = function() {
    var db_config =  {
            host     : '127.0.0.1',
            user     : 'root',
            password : '',
            port     : 3306,
            database : 'eden_mysql',
            multipleStatements : true
        };

    before(function(done) {
        var db = mysql(
                db_config.host,
                db_config.port,
                '',
                db_config.user,
                db_config.password
            );

        db.query('DROP DATABASE IF EXISTS eden_mysql;', function(e) {
            db.query('CREATE DATABASE eden_mysql;', function(e) {
                db.query('USE eden_mysql;', function(e) {
                    done();
                });
            });
        });
    });

    return mysql(
        db_config.host,
        db_config.port,
        db_config.database,
        db_config.user,
        db_config.password
    );
};
