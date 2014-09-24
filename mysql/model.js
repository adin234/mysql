module.exports = require('eden-model').extend(function() {
	/* Require
	-------------------------------*/
	var time = require('eden-time');
	
	/* Constants
	-------------------------------*/
	this.COLUMNS 	= 'columns';
	this.PRIMARY 	= 'primary';
	this.DATETIME 	= 'Y-m-d H:i:s';
	this.DATE	 	= 'Y-m-d';
	this.TIME	 	= 'H:i:s';
	this.TIMESTAMP	= 'U';
	
	this.TABLE_NOT_SET 		= 'No default table set or was passed.';
	this.DATABASE_NOT_SET 	= 'No default database set or was passed.';
	this.REMOVE_AMBIGUOUS	= 'Cannot remove row because data is ambiguous';
	this.UPDATE_AMBIGUOUS	= 'Cannot update row because data is ambiguous';
	
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._table 	= null;
	this._database 	= null;
	
	/* Private Properties
	-------------------------------*/
	var __noop = function() {};
	var __meta = {};
	var __uid = 0;
	
	/* Magic
	-------------------------------*/
	/* Public.Methods
	-------------------------------*/
	/**
	 * Useful method for formating a time column.
	 * 
	 * @param string
	 * @param string
	 * @return this
	 */
	this.formatTime = function(column, format) {
		//Argument Test
		this.argument()
			.test(1, 'string', 'number')	//Argument 1 must be a string
			.test(2, 'string', 'undef');	//Argument 2 must be a string
		
		//if the column isn't set
		if(typeof this._data[column] === 'undefined') {
			//do nothing more
			return this;
		}
		
		if(!isNaN(parseInt(this._data[column]))) {
			this._data[column] = parseInt(this._data[column]);
		//if this is column is a string
		} else if(typeof this._data[column] === 'string') {
			this._data[column] = (new Date(this._data[column])).getTime();
		}
		
		//if this column is not an integer
		if(typeof this._data[column] !== 'number') {
			return this;
		}
		
		//set it
		this._data[column] = time().toDate(this._data[column], format);
		
		return this;
	};
	
	/**
	 * Inserts model to database
	 *
	 * @param string
	 * @param Eden_Sql_Database
	 * @return this
	 */
	this.insert = function(table, database, callback) {
		this.argument()
			.test(1, 'string', 'function', 'undef')
			.test(2, 'object', 'function', 'undef')
			.test(3, 'function', 'undef');
		
		if(typeof table === 'function') {
			callback 	= table;
			table 		= undefined;
			database 	= undefined;
		} else if(typeof database === 'function') {
			callback 	= database;
			database 	= undefined;
		}
		
		callback = callback || __noop;
		
		//if no table
		if(typeof table === 'undefined') {
			//if no default table either
			if(!this._table) {
				callback(new Error(this.TABLE_NOT_SET));
				return;
			}
			
			table = this._table;
		}
		
		//if no database
		if(typeof database === 'undefined') {
			//and no default database
			if(!this._database) {
				callback(new Error(this.DATABASE_NOT_SET));
				return;
			}
			
			database = this._database;
		}
		
		//get the meta data, the valid column values and whether is primary is set
		var self = { _data: this._data, _getValidColumns: this._getValidColumns },
			_data 		= this._data,
			PRIMARY 	= this.PRIMARY;
		
		this._getMeta(table, database, function(error, meta) {
			var data = self._getValidColumns(Object.keys(meta[this.COLUMNS]));	
		
			var instance = this;
			
			//we insert it
			database.insertRow(table, data, function(error, info) {
				if(error) {
					callback(error);
					return;
				}
				
				//only if we have 1 primary key
				if(meta[PRIMARY].length === 1) {
					//set the primary key
					_data[meta[PRIMARY][0]] = info.insertId;
				}
				
				callback(error, instance, info);
			});	
		}.bind(this));
		
		return this;
	};
	
	/**
	 * Removes model from database
	 *
	 * @param string
	 * @param Eden_Sql_Database
	 * @param string|array|null
	 * @return this
	 */
	this.remove = function(table, database, callback) {
		this.argument()
			.test(1, 'string', 'function', 'undef')
			.test(2, 'object', 'function', 'undef')
			.test(3, 'function', 'undef');
		
		if(typeof table === 'function') {
			callback 	= table;
			table 		= undefined;
			database 	= undefined;
		} else if(typeof database === 'function') {
			callback 	= database;
			database 	= undefined;
		}
		
		callback = callback || __noop;
		
		//if no table
		if(typeof table === 'undefined') {
			//if no default table either
			if(!this._table) {
				callback(new Error(this.TABLE_NOT_SET));
				return;
			}
			
			table = this._table;
		}
		
		//if no database
		if(typeof database === 'undefined') {
			//and no default database
			if(!this._database) {
				callback(new Error(this.DATABASE_NOT_SET));
				return;
			}
			
			database = this._database;
		}
		
		//get the meta data, the valid column values and whether is primary is set
		var self = { _data: this._data, _getValidColumns: this._getValidColumns };
		
		//get the meta data, the valid column values and whether is primary is set
		this._getMeta(table, database, function(error, meta) {
			var data = self._getValidColumns(Object.keys(meta[this.COLUMNS]));
		
			//from here it means that this table has primary 
			//columns and all primary values are set
			
			for(var filter = [], i = 0; i < meta[this.PRIMARY].length; i++) {
				if(typeof data[meta[this.PRIMARY][i]] === 'undefined') {
					callback(new Error(this.REMOVE_AMBIGUOUS));
					return;
				}
				
				filter.push([meta[this.PRIMARY][i] + ' = ?', data[meta[this.PRIMARY][i]]]);
			}
			
			var instance = this;
			
			//we delete it
			database.removeRows(table, filter, function(error, info) {
				if(error) {
					callback(error);
					return;
				}
				
				callback(error, instance, info);
			});			
		}.bind(this));
		
		return this;
	};
	
	/**
	 * Inserts or updates model to database
	 *
	 * @param string
	 * @param Eden_Sql_Database
	 * @param string|array|null
	 * @return this
	 */
	this.save = function(table, database, callback) {
		this.argument()
			.test(1, 'string', 'function', 'undef')
			.test(2, 'object', 'function', 'undef')
			.test(3, 'function', 'undef');
		
		if(typeof table === 'function') {
			callback 	= table;
			table 		= undefined;
			database 	= undefined;
		} else if(typeof database === 'function') {
			callback 	= database;
			database 	= undefined;
		}
		
		callback = callback || __noop;
		
		//if no table
		if(typeof table === 'undefined') {
			//if no default table either
			if(!this._table) {
				callback(new Error(this.TABLE_NOT_SET));
				return;
			}
			
			table = this._table;
		}
		
		//if no database
		if(typeof database === 'undefined') {
			//and no default database
			if(!this._database) {
				callback(new Error(this.DATABASE_NOT_SET));
				return;
			}
			
			database = this._database;
		}
		
		var self = { _data: this._data, _isPrimarySet: this._isPrimarySet };
		
		//get the meta data, the valid column values and whether is primary is set
		this._getMeta(table, database, function(error, meta) {
			var primarySet = self._isPrimarySet(meta[this.PRIMARY]);	
		
			//if no primary meta or primary values are not set
			if(!meta[this.PRIMARY].length || !primarySet) {
				return this.insert(table, database, callback);
			}
			
			return this.update(table, database, callback);
		}.bind(this));
		
		
	};
	
	/**
	 * Sets the default database
	 *
	 * @param Eden_Sql
	 */
	this.setDatabase = function(database) {
		this.argument().test(1, 'object');
		
		this._database = database;
		return this;
	};
	
	/**
	 * Sets the default database
	 *
	 * @param string
	 */
	this.setTable = function(table) {
		//Argument 1 must be a string
		this.argument().test(1, 'string');
		
		this._table  = table;
		return this;
	};
	
	/**
	 * Updates model to database
	 *
	 * @param string
	 * @param Eden_Sql_Database
	 * @param string|array|null
	 * @return this
	 */
	this.update = function(table, database, callback) {
		this.argument()
			.test(1, 'string', 'function', 'undef')
			.test(2, 'object', 'function', 'undef')
			.test(3, 'function', 'undef');
		
		if(typeof table === 'function') {
			callback 	= table;
			table 		= undefined;
			database 	= undefined;
		} else if(typeof database === 'function') {
			callback 	= database;
			database 	= undefined;
		}
		
		callback = callback || __noop;
		
		//if no table
		if(typeof table === 'undefined') {
			//if no default table either
			if(!this._table) {
				callback(new Error(this.TABLE_NOT_SET));
				return;
			}
			
			table = this._table;
		}
		
		//if no database
		if(typeof database === 'undefined') {
			//and no default database
			if(!this._database) {
				callback(new Error(this.DATABASE_NOT_SET));
				return;
			}
			
			database = this._database;
		}
		
		var self = { _data: this._data, _getValidColumns: this._getValidColumns };
		
		//get the meta data, the valid column values and whether is primary is set
		this._getMeta(table, database, function(error, meta) {
			var data = self._getValidColumns(Object.keys(meta[this.COLUMNS]));
		
			//from here it means that this table has primary 
			//columns and all primary values are set
			
			for(var filter = [], i = 0; i < meta[this.PRIMARY].length; i++) {
				if(typeof data[meta[this.PRIMARY][i]] === 'undefined') {
					callback(new Error(this.UPDATE_AMBIGUOUS));
					return;
				}
				
				filter.push([meta[this.PRIMARY][i] + ' = ?', data[meta[this.PRIMARY][i]]]);
			}
			
			var instance = this;
			
			//we update it
			database.updateRows(table, data, filter, function(error, info) {
				if(error) {
					callback(error);
					return;
				}
				
				callback(error, instance, info);
			});				
		}.bind(this));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._isPrimarySet = function(primary) {
		for(var i = 0; i < primary.length; i++) {
			if(typeof this._data[primary[i]] === 'undefined') {
				return false;
			}
		}
		
		return true;
	}
	
	this._getMeta = function(table, database, callback) {
		if(typeof database.____MYSQL_MODEL_UID === 'undefined') {
			database.____MYSQL_MODEL_UID = ++__uid;
		}
		
		var uid = database.____MYSQL_MODEL_UID;
		
		if(typeof __meta[uid] !== 'undefined'
		&& typeof __meta[uid][table] !== 'undefined') {
			callback(null, __meta[uid][table]);
			return this;
		}
		
		if(typeof __meta[uid] === 'undefined') {
			__meta[uid] = {};
		}
		
		var _columns = this.COLUMNS;
		var _primary = this.PRIMARY;
		
		database.getColumns(table, function(error, columns) {
			if(error) {
				callback(error);
				return;
			}
			
			var meta = {};
			
			meta[_columns] = {};
			meta[_primary] = [];
			
			for(var i = 0; i < columns.length; i++) {
				meta[_columns][columns[i].Field] = {
					type	: columns[i].Type,
					key		: columns[i].Key,
					default	: columns[i].Default,
					empty	: columns[i].Null === 'YES'};
				
				if(columns[i].Key === 'PRI') {
					meta[_primary].push(columns[i].Field);
				}
			}
			
			__meta[uid][table] = meta;
			
			callback(null, __meta[uid][table]);
		});
		
		return this;
	};
	
	this._getValidColumns = function(columns) {
		for(var valid = {}, i = 0; i < columns.length; i++) {
			if(typeof this._data[columns[i]] === 'undefined') {
				continue;
			}
			
			valid[columns[i]] = this._data[columns[i]];
		} 
		
		return valid;
	};
	
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql/model');