module.exports = require('eden-class').extend(function() {
	/* Require
	-------------------------------*/
	var collection = require('./collection');
	
	/* Constants
	-------------------------------*/
	this.LEFT 	= 'LEFT';
	this.RIGHT 	= 'RIGHT';
	this.INNER 	= 'INNER';
	this.OUTER 	= 'OUTER';
	this.ASC	= 'ASC';
	this.DESC	= 'DESC';
	
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._database 	= null;
	this._bindings 	= [];
	this._table		= null;
	this._group		= [];
	this._columns	= [];
	this._join 		= [];
	this._filter	= [];
	this._sort		= {};
	this._start		= 0;
	this._range		= 0;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(database) {
		this.argument().test(1, 'object');	
		this._database = database;
	};
	
	this.___get = function(name) {
		if(name.indexOf('filterBy') === 0
		|| name.indexOf('sortBy') === 0) {
			return function() {
				var separator = '_';
				
				//it is filterByFooBar -> foo_bar
				if(name.indexOf('filterBy') === 0) {
					if(typeof arguments[1] === 'string') {
						separator = arguments[1];
					}
					
					var key = name
						.replace(/([A-Z0-9])/g, separator + '$1')
						.substr(9 + separator.length)
						.toLowerCase();
						
					key = key + ' = ?';
					
					return this.addFilter(key, arguments[0] || null);
				}
				
				//it is filterFooBar -> foo_bar
				if(name.indexOf('sortBy') === 0) {
					if(typeof arguments[1] === 'string') {
						separator = arguments[1];
					}
					
					var key = name
						.replace(/([A-Z0-9])/g, separator + '$1')
						.substr(7 + separator.length)
						.toLowerCase();
					
					return this.addSort(key, arguments[0] || 'ASC');
				}
			};
		}
	};
	
	/* Public.Methods
	-------------------------------*/
	/**
	 * Adds filter
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.addFilter = function() {
		this.argument().test(1, 'string');
		
		this._filter.push(Array.prototype.slice.apply(arguments));
		
		return this;
	};
	
	/**
	 * Adds sort
	 * 
	 * @param string
	 * @param string
	 * @return this
	 */
	this.addSort = function(column, order) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string', 'undef');
		
		order = order || this.ASC;
		
		if(order !== this.DESC) {
			order = this.ASC;
		}
		
		this._sort[column] = order;
		
		return this;
	}
	
	/**
	 * Returns the results in a collection
	 *
	 * @param function callback
	 * @return this
	 */
	this.getCollection = function(callback) {
		var table 		= this._table;
		var database 	= this._database;
		
		return this.getRows(function(error, rows, meta) {
			if(error) {
				callback(error);
				return;
			}
			
			rows = rows || [];
			
			callback(error, collection()
				.setDatabase(database)
				.setTable(table)
				.set(rows), meta);
		});
	};
	
	/**
	 * Returns the one result in a model
	 *
	 * @param int
	 * @param function callback
	 * @return this
	 */
	this.getModel = function(index, callback) {
		this.argument()
			.test(1, 'int', 'undef', 'function')
			.test(2, 'undef', 'function');
		
		if(typeof index === 'function') {
			callback = index;
			index = 0;
		}
		
		index = index || 0;
		
		return this.getCollection(function(error, collection, meta) {
			callback(error, collection[index], meta);
		});
	};
	
	/**
	 * Returns the one result
	 *
	 * @param int|string
	 * @param string|null
	 * @param function callback
	 * @return this
	 */
	this.getRow = function(index, column, callback) {
		this.argument()
			.test(1, 'numeric', 'function')
			.test(2, 'string', 'function', 'null', 'undef')
			.test(2, 'function', 'undef');
		
		if(typeof index === 'function') {
			callback = index;
			column = null;
			index = 0;
		} else if(typeof column === 'function') {
			callback = column;
			column = null;
		}
		
		return this.getRows(function(error, rows, meta) {
			if(error) {
				callback(error);
				return;
			}
			
			if(column && typeof rows[index] !== 'undefined'
			&& typeof rows[index][column] !== 'undefined') {
				callback(error, rows[index][column], meta);
				return;
			} 
			
			if(!column && typeof rows[index] !== 'undefined') {
				callback(error, rows[index], meta);
				return;
			}
			
			callback(error, null, meta);
		});
		
		return this;
	};
	
	/**
	 * Returns the array rows
	 *
	 * @param function callback
	 * @return this
	 */
	this.getRows = function(callback) {
		var query = this._getQuery();
		
		if(this._columns.length) {
			query[0].select(this._columns.join(', '));
		}
		
		for(var key in this._sort) {
			query[0].sortBy(key, this._sort[key]);
		}
		
		if(this._range) {
			query[0].limit(this._start, this._range);
		}
		
		if(this._group.length) {
			query[0].groupBy(this._group);
		}
		
		this._database.query(query[0].getQuery(), query[1], callback);
		
		return this;
	};
	
	/**
	 * Returns the total results
	 *
	 * @param function callback
	 * @return this
	 */
	this.getTotal = function(callback) {
		var query 	= this._getQuery().select('COUNT(*) as total');
		
		this._database.query(query[0].getQuery(), query[1], function(error, rows) {
			if(error) {
				callback(error);
				return;
			}
			
			if(typeof rows[0].total === 'undefined') {
				callback(error, 0);
				return;
			}
			
			callback(error, rows[0].total);
		});
		
		return this;
	};
	
	/**
	 * Adds Inner Join On
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.innerJoinOn = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.INNER, table, where, false]);
		
		return this;
	};
	
	/**
	 * Adds Inner Join Using
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.innerJoinUsing = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.INNER, table, where, true]);
		
		return this;
	};
	
	/**
	 * Adds Left Join On
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.leftJoinOn = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.LEFT, table, where, false]);
		
		return this;
	};
	
	/**
	 * Adds Left Join Using
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.leftJoinUsing = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.LEFT, table, where, true]);
		
		return this;
	};
	
	/**
	 * Adds Outer Join On
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.outerJoinOn = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.OUTER, table, where, false]);
		
		return this;
	};
	
	/**
	 * Adds Outer Join USing
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.outerJoinUsing = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.OUTER, table, where, true]);
		
		return this;
	};
	
	/**
	 * Adds Right Join On
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.rightJoinOn = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.RIGHT, table, where, false]);
		
		return this;
	};
	
	/**
	 * Adds Right Join Using
	 * 
	 * @param string
	 * @param string[,string..]
	 * @return this
	 */
	this.rightJoinUsing = function(table, where) {
		this.argument()
			.test(1, 'string')
			.test(2, 'string');
		
		var where = Array.prototype.slice.apply(arguments);
		var table = where.shift();
		
		this._join.push([this.RIGHT, table, where, true]);
		
		return this;
	};
	
	/**
	 * Sets Columns
	 * 
	 * @param string[,string..]|array
	 * @return this
	 */
	this.setColumns = function(columns) {
		if(!(columns instanceof Array)) {
			columns = Array.prototype.slice.apply(arguments);
		}
		
		this._columns = columns;
		
		return this;
	};
	
	/**
	 * Group by clause
	 *
	 * @param string group
	 * @return this
	 * @notes adds broup by functionality
	 */
	this.setGroup = function(group) {
		 //Argument 1 must be a string or array
		 this.argument().test(1, 'string', 'array');	
			
		if(typeof group === 'string') {
			group = [group]; 
		}
		
		this._group = group; 
		return this;
	};
	
	/**
	 * Sets the pagination page
	 *
	 * @param int
	 * @return this
	 */
	this.setPage = function(page) {
		this.argument().test(1, 'int');
		
		if(page < 1) {
			page = 1;
		}
		
		this._start = (page - 1) * this._range;
		
		return this;
	};
	
	/**
	 * Sets the pagination range
	 *
	 * @param int
	 * @return this
	 */
	this.setRange = function(range) {
		this.argument().test(1, 'int');
		
		if(range < 0) {
			range = 25;
		}
		
		this._range = range;
		
		return this;
	};
	
	/**
	 * Sets the pagination start
	 *
	 * @param int
	 * @return this
	 */
	this.setStart = function(start) {
		this.argument().test(1, 'int');
		
		if(start < 0) {
			start = 0;
		}
		
		this._start = start;
		
		return this;
	};
	
	/**
	 * Sets Table
	 * 
	 * @param string
	 * @return this
	 */
	this.setTable = function(table) {
		this.argument().test(1, 'string');
		this._table = table;
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._getQuery = function() {
		var query = this._database.select().from(this._table);
		var joins = Array.prototype.slice.apply(this._join);
		var bindings = [];
		
		for(var where, binds, j, i = 0; i < joins.length; i++) {
			if(!(joins[i][2] instanceof Array)) {
				joins[i][2] = [joins[i][2]];
			}
			
			binds = Array.prototype.slice.apply(joins[i][2]);
			
			where = binds.shift();
			for(j = 0; j < binds.length; j++) {
				bindings.push(binds[j]);
				binds[j] = '?';
			}
			
			query.join(joins[i][0], joins[i][1], where, joins[i][3]);
		}
		
		var filters = Array.prototype.slice.apply(this._filter);
		
		for(i = 0; i < filters.length; i++) {
			binds = Array.prototype.slice.apply(filters[i]);
			
			where = binds.shift();
			
			bindings = bindings.concat(binds);
			
			query.where(where);
		}
		
		return [query, bindings];
	};
	
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql/search');