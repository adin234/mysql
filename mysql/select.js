module.exports = require('eden-class').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._select 	= null;
	this._from 		= null;
	this._joins 	= [];
	this._where 	= [];
	this._sortBy	= [];
	this._group		= [];
	this._page 		= null;
	this._length	= null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(select) {
		this.argument().test(1, 'string', 'array', 'undef');	
		
		this.select(select || '*');
	};
	
	/* Public.Methods
	-------------------------------*/
	/**
	 * From clause
	 *
	 * @param string from
	 * @return this
	 * @notes loads from phrase into registry
	 */
	this.from = function(from) {
		//Argument 1 must be a string
		this.argument().test(1, 'string');
		
		this._from = from;
		return this;
	};
	
	/**
	 * Returns the string version of the query 
	 *
	 * @param  bool
	 * @return string
	 * @notes returns the query based on the registry
	 */
	this.getQuery = function() {
		var joins 	= this._joins.length 	? this._joins.join(' '): '';
		var where 	= this._where.length 	? 'WHERE ' + this._where.join(' AND '): '';
		var sort 	= this._sortBy.length 	? 'ORDER BY '+ this._sortBy.join(', '): '';
		var group 	= this._group.length 	? 'GROUP BY ' + this._group.join(', '): '';
		var limit 	= this._page !== null 	? 'LIMIT ' + this._page: false;
		
		limit	= limit && this._length !== null ? limit + ',' + this._length: ''; 
		
		var query = 'SELECT {SELECT} FROM {FROM} {JOINS} {WHERE} {GROUP} {SORT} {LIMIT};'
			.replace('{SELECT}'	, this._select)
			.replace('{FROM}'	, this._from)
			.replace('{JOINS}'	, joins)
			.replace('{WHERE}'	, where)
			.replace('{GROUP}'	, group)
			.replace('{SORT}'	, sort)
			.replace('{LIMIT}'	, limit);
		
		return query.replace(/\s\s/ig, ' ').replace(' ;', ';');
	};
	
	/**
	 * Group by clause
	 *
	 * @param string group
	 * @return this
	 * @notes adds broup by functionality
	 */
	this.groupBy = function(group) {
		 //Argument 1 must be a string or array
		 this.argument().test(1, 'string', 'array');	
			
		if(typeof group === 'string') {
			group = [group]; 
		}
		
		this._group = group; 
		return this;
	};
	
	/**
	 * Inner join clause
	 *
	 * @param string table
	 * @param string where
	 * @param bool on
	 * @return this
	 * @notes loads inner join phrase into registry
	 */
	this.innerJoin = function(table, where, using) {
		//argument test
		this.argument()
			.test(1, 'string')			//Argument 1 must be a string
			.test(2, 'string') 			//Argument 2 must be a string
			.test(3, 'bool', 'undef'); 	//Argument 3 must be a boolean
		
		return this.join('INNER', table, where, using);
	};
	
	/**
	 * Allows you to add joins of different types
	 * to the query 
	 *
	 * @param string type
	 * @param string table
	 * @param string where
	 * @param bool on
	 * @return this
	 * @notes loads join phrase into registry
	 */
	this.join = function(type, table, where, using) {
		//argument test
		this.argument()
			.test(1, 'string')			//Argument 1 must be a string
			.test(2, 'string') 			//Argument 2 must be a string
			.test(3, 'string') 			//Argument 3 must be a string
			.test(4, 'bool', 'undef'); 	//Argument 4 must be a boolean
		
		var linkage = using !== false ? 'USING (' + where + ')' : ' ON (' + where + ')';
		this._joins.push(type + ' JOIN ' + table + ' ' + linkage);
		
		return this;
	};
	
	/**
	 * Left join clause
	 *
	 * @param string table
	 * @param string where
	 * @param bool on
	 * @return this
	 * @notes loads left join phrase into registry
	 */
	this.leftJoin = function(table, where, using) {
		//argument test
		this.argument()
			.test(1, 'string')			//Argument 1 must be a string
			.test(2, 'string') 			//Argument 2 must be a string
			.test(3, 'bool', 'undef'); 	//Argument 3 must be a boolean
		
		return this.join('LEFT', table, where, using);
	};
	
	/**
	 * Limit clause
	 *
	 * @param string|int page
	 * @param string|int length
	 * @return this
	 * @notes loads page and length into registry
	 */
	this.limit = function(page, length) {
		//argument test
		this.argument()
			.test(1, 'numeric')		//Argument 1 must be a number
			.test(2, 'numeric');	//Argument 2 must be a number
		
		this._page = page;
		this._length = length; 

		return this;
	};
	
	/**
	 * Outer join clause
	 *
	 * @param string table
	 * @param string where
	 * @param bool on
	 * @return this
	 * @notes loads outer join phrase into registry
	 */
	this.outerJoin = function(table, where, using) {
		//argument test
		this.argument()
			.test(1, 'string')			//Argument 1 must be a string
			.test(2, 'string') 			//Argument 2 must be a string
			.test(3, 'bool', 'undef'); 	//Argument 3 must be a boolean
		
		return this.join('OUTER', table, where, using);
	};
	
	/**
	 * Right join clause
	 *
	 * @param string table
	 * @param string where
	 * @param bool on
	 * @return this
	 * @notes loads right join phrase into registry
	 */
	this.rightJoin = function(table, where, using) {
		//argument test
		this.argument()
			.test(1, 'string')			//Argument 1 must be a string
			.test(2, 'string') 			//Argument 2 must be a string
			.test(3, 'bool', 'undef'); 	//Argument 3 must be a boolean
		
		return this.join('RIGHT', table, where, using);
	};
	
	/**
	 * Select clause
	 *
	 * @param string select
	 * @return this
	 * @notes loads select phrase into registry
	 */
	this.select = function(select) {
		select = select || '*';
		
		//Argument 1 must be a string or array
		this.argument().test(1, 'string', 'array');
		
		//if select is an array
		if(select instanceof Array) {
			//transform into a string
			select = select.join(', ');
		}
		
		this._select = select;
		
		return this;
	};
	
	/**
	 * Order by clause
	 *
	 * @param string field
	 * @param string order
	 * @return this
	 * @notes loads field and order into registry
	 */
	this.sortBy = function(field, order) {
		//argument test
		this.argument()
			.test(1, 'string')				//Argument 1 must be a string
			.test(2, 'string', 'undef'); 	//Argument 2 must be a string
		
		order = order || 'ASC'
		
		this._sortBy.push(field + ' ' + order);
		
		return this;
	};
	
	/**
	 * Where clause
	 *
	 * @param array|string where
	 * @return	this
	 * @notes loads a where phrase into registry
	 */
	this.where = function(where) {
		//Argument 1 must be a string or array
		this.argument().test(1, 'string', 'array');
		
		if(typeof where === 'string') {
			where = [where];
		}
		
		this._where = this._where.concat(where); 
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql/select');