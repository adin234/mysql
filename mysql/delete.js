module.exports = require('eden-class').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._table 	= null;
	this._where 	= [];
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(table) {
		this.argument().test(1, 'string', 'undef');	
		
		if(typeof table === 'string') {
			this.setTable(table);
		}
	};
	
	/* Public.Methods
	-------------------------------*/
	/**
	 * Set the table name in which you want to delete from
	 *
	 * @param string name
	 * @return this
	 */
	this.setTable = function(table) {
		//argument test
		this.argument().test(1, 'string');
		
		this._table = table;
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
		return 'DELETE FROM {TABLE} WHERE {WHERE};'
			.replace('{TABLE}'	, this._table)
			.replace('{WHERE}'	, this._where.join(' AND '));
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
}).register('eden/mysql/delete');