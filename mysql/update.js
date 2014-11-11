module.exports = require('./delete').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._set 	= {};
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public.Methods
	-------------------------------*/
	/**
	 * Returns the string version of the query 
	 *
	 * @param  bool
	 * @return string
	 * @notes returns the query based on the registry
	 */
	this.getQuery = function() {
		var set = [];
		
		for(var key in this._set) {
			if(this._set.hasOwnProperty(key)) {
				set.push(key + ' = ' + this._set[key]);
			}
		}
		
		return 'UPDATE {TABLE} SET {SET} WHERE {WHERE};'
			.replace('{TABLE}'	, this._table)
			.replace('{SET}'	, set.join(', '))
			.replace('{WHERE}'	, this._where.join(' AND '));
	};
	
	/**
	 * Set clause that assigns a given field name to a given value.
	 *
	 * @param string
	 * @param string
	 * @return this
	 * @notes loads a set into registry
	 */
	this.set = function(key, value) {
		//argument test
		this.argument()
			.test(1, 'string', 'object')							//Argument 1 must be a string
			.test(2, 'numeric', 'string', 'bool', 'null', 'undef');	//Argument 2 must be scalar or null
		
		if(typeof key === 'object') {
			for(var i in key) {
				if(key.hasOwnProperty(i)) {
					this.set(i, key[i]);
				}
			}
			
			return this;	
		}
		
		if(value === null) {
			value = 'NULL';
		} else if(typeof value === 'boolean') {
			value = value ? 1 : 0;
		} else if(typeof value === 'string' && value !== '?') {
			value = "'" + value + "'";
		}
		
		this._set[key] = value;
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql/update');