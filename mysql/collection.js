module.exports = require('eden-collection').extend(function() {
	/* Require
	-------------------------------*/
	var model = require('./model');
	
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._database = null;
	this._table = null;
	
	/* Private Properties
	-------------------------------*/
	var __noop = function() {};
	
	/* Magic
	-------------------------------*/
	this.___get = function(name) {
		if(name === 'length') {
			return this._list.length;
		}
		
		if(typeof name === 'number'
		&& typeof this._list[name] !== 'undefined') {
			return this._list[name];
		}
		
		var length = this._list.length;
			
		return function() {
			var args 	= Array.prototype.slice.apply(arguments),
				self 	= this,
				callbck = __noop,
				errors	= [],
				metas	= [],
				pass	= ['save', 'insert', 'remove', 'update'];
			
			if(pass.indexOf(name) !== -1) {
				callback = args.pop();
				
				args.push(function(error, model, meta) {
					errors.push(error);
					metas.push(meta);
					
					if(pass.indexOf(name) !== -1 && errors.length === length) {
						callback(errors, self, metas);
					}
				});
			}
			
			return this.each(function(i, model) {
				if(typeof model[name] === 'function') {
					model[name].apply(model, args);
				}
			});
		};
	};
	
	/* Public.Methods
	-------------------------------*/
	/**
	 * Adds a row to the collection
	 *
	 * @param object
	 * @return this
	 */
	this.add = function(row) {
		//Argument 1 must be an object
		this.argument().test(1, 'object');

		row = model(row);
		
		if(this._database) {
			row.setDatabase(this._database);
		}
		
		if(this._table) {
			row.setTable(this._table);
		}
		
		//add it now
		this._list.push(row);
		
		return this;
	};
	
	/**
	 * Sets the default database
	 *
	 * @param Eden_Sql
	 */
	this.setDatabase = function(database) {
		this.argument().test(1, 'object');
		
		this._database = database;
		
		this.each(function(i, model) {
			model.setDatabase(database);
		});
		
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
		
		
		this.each(function(i, model) {
			model.setTable(table);
		});
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eden/mysql/model');