module.exports = require('eden-class').extend(function() {
	/* Require
	-------------------------------*/
	var resource 	= require('mysql');
	var model 		= require('./mysql/model');
	var collection 	= require('./mysql/collection');
	
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._connection	= null;
	this._config 		= {};
	
	/* Private Properties
	-------------------------------*/
	var __noop = function() {};
	
	/* Magic
	-------------------------------*/
	this.___construct = function(host, name, user, pass) {
		this.argument()
			.test(1, 'string', 'object')
			.test(2, 'string')
			.test(3, 'string')
			.test(4, 'string', 'undef')
		
		pass = pass || '';
		
		if(typeof host === 'object') {
			this._config = host;
			return;
		}
		
		this._config = {
			host		: host,
			user		: user,
			password	: pass,
			database	: name };	
	};
	
	/* Public.Methods
	-------------------------------*/
	/**
	 * Returns collection
	 *
	 * @return Eden_Sql_Collection
	 */
	this.collection = function(table) {
		var collection = require('./mysql/collection')().setDatabase(this);
			
		if(typeof table === 'string' && table.length) {	
			collection.setTable(table);
		}
		
		return collection;
	};
	
	/**
	 * Connects to the database
	 * 
	 * @param array the connection options
	 * @return this
	 */
	this.connect = function() {
		if(!this._connection) {
			this._connection = resource.createConnection(this._config);
			this._connection.connect();
		}
		
		return this;
	};
	
	/**
	 * Returns the connection object
	 * if no connection has been made 
	 * it will attempt to make it
	 *
	 * @param array connection options
	 * @return connection resource
	 */
	this.getConnection = function() {
		return this._connection;
	};
	
	/**
	 * Returns the columns and attributes given the table name
	 *
	 * @param the name of the table
	 * @return attay|false
	 */
	this.getColumns = function(table, filters, callback) {
		
		//Argument 1 must be a string
		this.argument()
			.test(1, 'string')
			.test(2, 'string', 'array', 'function')
			.test(3, 'function', 'undef');
		
		if(typeof filters === 'function') {
			callback = filters;
			filters = [];
		}
		
		var bindings = [];
		
		if(filters instanceof Array) {
			filters = Array.prototype.slice.apply(filters);
			
			for(var filter, i = 0; i < filters.length; i++) {
				filter = Array.prototype.slice.apply(filters[i]);
				//array('post_id=%s AND post_title IN %s', 123, array('asd'));
				filters[i] = filter.shift();
				bindings = bindings.concat(filter);
			}
		}
		
		callback = callback || __noop;
		
		var query = 'SHOW FULL COLUMNS FROM `' + table + '`' + filters.join(' AND ');
		
		this.query(query, bindings, callback);
		
		return this;
	};
	
	/**
	 * Returns a 1 row result given the column name and the value
	 *
	 * @param string table
	 * @param string name
	 * @param string value
	 * @param function callback
	 * @return this
	 */
	this.getRow = function(table, column, value, callback) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string')
			.test(3, 'numeric', 'string', 'boolean')
			.test(4, 'function', 'undef');
		
		callback = callback || __noop;
		
		var query = this.select()
			.from(table)
			.where(column + ' = ?')
			.limit(0, 1)
			.getQuery();
			
		this.query(query, [value], function(error, rows) {
			rows = rows || [];
			callback(error, rows[0] || null);
		});
		
		return this;
	};
	
	/**
	 * Returns the insert query builder
	 *
	 * @param string
	 * @return Eden_Sql_Insert
	 */ 
	this.insert = function(table) {
		return require('./mysql/insert')(table);
	};
	
	/**
	 * Inserts data into a table and returns the ID
	 *
	 * @param string table
	 * @param object setting
	 * @param array|bool|null
	 * @param function callback
	 * @return this
	 */
	this.insertRow = function(table, setting, bind, callback) {
		this.argument()
			.test(1, 'string')
			.test(2, 'object')
			.test(3, 'array', 'bool', 'null', 'function', 'undef')
			.test(4, 'function', 'undef');
		
		if(typeof bind === 'function') {
			callback = bind;
			bind = null;
		}
		
		if(bind === null || typeof bind === 'undefined') {
			bind = true;
		}
		
		callback = callback || __noop;
		
		var query = this.insert(table), bindings = [];
		
		for(var key in setting) {
			if(setting.hasOwnProperty(key)) {
				if(setting[key] === null || typeof setting[key] === 'boolean') {
					query.set(key, setting[key]);
					continue;
				}
				
				if( (typeof bind === 'boolean' && bind) 
				|| (bind instanceof Array && bind.indexOf(key) !== -1)) {
					bindings.push(setting[key]);
					setting[key] = '?';
					
				}
				
				query.set(key, setting[key]);
			}
		}
		
		//run the query
		this.query(query.getQuery(), bindings, callback);
		
		return this;
	};
	
	/**
	 * Inserts multiple rows into a table
	 *
	 * @param string table
	 * @param object settings
	 * @param array|bool|null
	 * @param function callback
	 * @return this
	 */
	this.insertRows = function(table, settings, bind, callback) {
		this.argument()
			.test(1, 'string')
			.test(2, 'array')
			.test(3, 'array', 'bool', 'null', 'function')
			.test(4, 'function', 'undef');
		
		if(typeof bind === 'function') {
			callback = bind;
			bind = null;
		}
		
		if(bind === null) {
			bind = true;
		}
		
		callback = callback || __noop;
		
		var query = this.insert(table), bindings = [];
		
		for(var key, setting, i = 0; i < settings.length; i++) {
			setting = settings[i];
			for(key in setting) {
				if(setting.hasOwnProperty(key)) {
					if(setting[key] === null || typeof setting[key] === 'boolean') {
						query.set(key, setting[key]);
						continue;
					}
					
					if( (typeof bind === 'boolean' && bind) 
					|| (bind instanceof Array && bind.indexOf(key) !== -1)) {
						bindings.push(setting[key]);
						setting[key] = '?';		
					}
					
					query.set(key, setting[key], i);
				}
			}
		}
		
		//run the query
		this.query(query.getQuery(), bindings, callback);
		
		return this;
	};
	
	/**
	 * Returns model
	 *
	 * @return Eden_Sql_Search
	 */
	this.model = function(table) {
		var model = require('./mysql/model')().setDatabase(this);
		
		if(typeof table === 'string' && table.length) {
			model.setTable(table);
		}
		
		return model;
	};
	
	/**
	 * Queries the database
	 * 
	 * @param string query
	 * @param array binded value
	 * @return array|object
	 */
	this.query = function(query, bindings, callback) {
		this.argument()
			.test(1, 'string')
			.test(2, 'array', 'function')
			.test(3, 'function', 'undef');
		
		if(typeof bindings === 'function') {
			callback = bindings;
			bindings = [];
		}
		
		//defaults
		bindings = bindings || [];
		callback = callback || __noop;
		
		//if its not connected already
		if(!this._connection) {
			//connect
			this.connect();
		}
		
		//prepare the query
		query = this._connection.format(query, bindings);
		
		var queries = this._queries;
		
		this._connection.query(query, callback);
	};
	
	/**
	 * Returns the delete query builder
	 *
	 * @param string
	 * @return Eden_Sql_Delete
	 */ 
	this.remove = function(table) {
		return require('./mysql/delete')(table);
	};
	
	/**
	 * Removes rows that match a filter
	 *
	 * @param string table
	 * @param array filter
	 * @param function callback
	 * @return this
	 */
	this.removeRows = function(table, filters, callback) {
		//Argument 1 must be a string
		this.argument()
			.test(1, 'string')
			.test(2, 'string', 'array')
			.test(3, 'function', 'undef');
		
		var query = this.remove(table), bindings = [];
		
		if(filters instanceof Array) {
			filters = Array.prototype.slice.apply(filters);
			
			for(var filter, i = 0; i < filters.length; i++) {
				filter = Array.prototype.slice.apply(filters[i]);
				//array('post_id=%s AND post_title IN %s', 123, array('asd'));
				filters[i] = filter.shift();
				bindings = bindings.concat(filter);
			}
		}
		
		query.where(filters);
		
		//run the query
		this.query(query.getQuery(), bindings, callback || __noop);
		
		return this;
	};
	
	/**
	 * Returns the select query builder
	 *
	 * @param string
	 * @return Eden_Sql_Select
	 */ 
	this.select = function(columns) {
		return require('./mysql/select')(columns);
	};
	
	/**
	 * Returns search
	 *
	 * @return Eden_Sql_Search
	 */
	this.search = function(table) {
		return require('./mysql/search')(this).setTable(table);
	};
	
	/**
	 * Sets only 1 row given the column name and the value
	 *
	 * @param string table
	 * @param string name
	 * @param string value
	 * @param object setting
	 * @param function callback
	 * @return var
	 */
	this.setRow = function(table, column, value, setting, callback) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string')
			.test(3, 'numeric', 'string', 'boolean')
			.test(4, 'object')
			.test(5, 'function', 'undef');
		
		callback = callback || __noop;
		
		this.getRow(table, column, value, function(error, row) {
			if(error) {
				callback(error);
				return;
			}
			
			if(!row) {
				this.insert(table, setting, callback);
				return;
			}
			
			this.update(table, [[column + ' = ?', value]], callback);
		});
	};
	
	/**
	 * Returns the update query builder
	 *
	 * @param string
	 * @return Eden_Sql_Update
	 */ 
	this.update = function(table) {
		return require('./mysql/update')(table);
	};
	
	/**
	 * Updates rows that match a filter given the update settings
	 *
	 * @param string table
	 * @param object setting
	 * @param array filter
	 * @param array|bool|null
	 * @param function callback
	 * @return this
	 */
	this.updateRows = function(table, setting, filters, bind, callback) {
		this.argument()
			.test(1, 'string')
			.test(2, 'object')
			.test(3, 'array', 'string')
			.test(4, 'array', 'bool', 'null', 'function', 'undef')
			.test(5, 'function', 'undef');
			
		if(typeof bind === 'function') {
			callback = bind;
			bind = null;
		}
		
		if(bind === null || typeof bind === 'undefined') {
			bind = true;
		}
		
		callback = callback || __noop;
		
		var query = this.update(table), bindings = [];
		
		for(var key in setting) {
			if(setting.hasOwnProperty(key)) {
				if(setting[key] === null || typeof setting[key] === 'boolean') {
					query.set(key, setting[key]);
					continue;
				}
				
				if( (typeof bind === 'boolean' && bind) 
				|| (bind instanceof Array && bind.indexOf(key) !== -1)) {
					bindings.push(setting[key]);
					setting[key] = '?';
					
				}
				
				query.set(key, setting[key]);
			}
		}
		
		if(filters instanceof Array) {
			filters = Array.prototype.slice.apply(filters);
			
			for(var filter, i = 0; i < filters.length; i++) {
				filter = Array.prototype.slice.apply(filters[i]);
				//array('post_id=%s AND post_title IN %s', 123, array('asd'));
				filters[i] = filter.shift();
				bindings = bindings.concat(filter);
			}
		}
		
		query.where(filters);
		
		//run the query
		this.query(query.getQuery(), bindings, callback);
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql');