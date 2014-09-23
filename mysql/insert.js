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
	this._keys		= [];
	this._values	= {};
	
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
	 * Returns the string version of the query 
	 *
	 * @param  bool
	 * @return string
	 * @notes returns the query based on the registry
	 */
	this.getQuery = function() {
		var values = [], value;
		
		for(var i in this._values) {
			if(this._values.hasOwnProperty(i)) {
				if(Object.keys(this._values[i]).length !== this._keys.length) {
					continue;
				}
				
				value = [];
				
				for(var j = 0; j < this._keys.length; j++) {
					value.push(this._values[i][this._keys[j]]);
				}
				
				values.push('(' + value.join(', ') + ')');
		
			}
		}
		
		return 'INSERT INTO {TABLE} ({KEYS}) VALUES {VALUES};'
			.replace('{TABLE}'	, this._table)
			.replace('{KEYS}'	, this._keys.join(', '))
			.replace('{VALUES}'	, values.join(', '));
	};
	
	/**
	 * Set clause that assigns a given field name to a given value.
	 * You can also use this to add multiple rows in one call
	 *
	 * @param string|object
	 * @param string|number|bool|null
	 * @param int
	 * @return this
	 * @notes loads a set into registry
	 */
	this.set = function(key, value, index) {
		//argument test
		this.argument()
			.test(1, 'string', 'object')							//Argument 1 must be a string
			.test(2, 'numeric', 'string', 'bool', 'null', 'undef')	//Argument 2 must be scalar or null
			.test(3, 'int', 'undef');
			
		index = index || 0;
		
		if(typeof key === 'object') {
			for(var i in key) {
				if(key.hasOwnProperty(i)) {
					this.set(i, key[i], value || 0);
				}
			}
			
			return this;	
		}
		
		if(this._keys.indexOf(key) === -1) {
			this._keys.push(key);
		}
		
		if(value === null) {
			value = 'NULL';
		} else if(typeof value === 'boolean') {
			value = value ? 1 : 0;
		} else if(typeof value === 'string' && value !== '?') {
			value = "'" + value + "'";
		}
		
		if(typeof this._values[index] === 'undefined') {
			this._values[index] = {};
		}
		
		this._values[index][key] = value;
		
		return this;
	};
	
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
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql/insert');