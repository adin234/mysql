#MySQL

DESCRIPTION

[![Build Status](https://api.travis-ci.org/edenjs/mysql.png)](https://travis-ci.org/edenjs/mysql)

## General

### Installation

```
npm install eden-mysql
```

### Usage

```
var mysql = require('eden-mysql');
var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');
```

## Methods

  * [collection](#collection)

  * [connect](#connect)

  * [getConnection](#getConnection)

  * [getColumns](#getColumns)

  * [getRow](#getRow)

  * [insert](#insert)

  * [insertRow](#insertRow)

  * [insertRows](#insertRows)

  * [model](#model)

  * [query](#query)

  * [remove](#remove)

  * [removeRows](#removeRows)

  * [select](#select)

  * [search](#search)

  * [setRow](#setRow)

  * [update](#update)

  * [updateRows](#updateRows)

---

<a name="collection"></a>

### collection

```
 eden/mysql/collection collection();
```

Returns collection

#### Parameters

#### Returns

 eden/mysql/collection

#### Example

##### Code

```
database.collection('eden_user')
.add({})
.add({})
.setFoo('bar')
.setUserName('Bobby2')
.setUserEmail('bobby2@gmail.com')
.setUserFacebook(123) });
    collection[0].foo;
    collection[1].user_email;
```

##### Outputs

```
'bar'
'bobby2@gmail.com'
```

---

<a name="connect"></a>

### connect

```
 this connect(Array);
```

Connects to the database

#### Parameters

  1. array - the connection options

#### Returns

 this

#### Example

##### Code

```
var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');
var connect = database.connect(['127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234']);

database == connect;
```

##### Outputs

```
true
```

---

<a name="getConnection"></a>

### getConnection

```
 connection resource getConnection(Array);
```

Returns the connection object if no connection has been made it will attempt to make it

#### Parameters

  1. array - connection options

#### Returns

 connection resource

#### Example

##### Code

```
var database = mysql('127.0.0.1', 3306, 'edenjs_test', 'root', 'Openovatelabs1234');
  database.getConnection();
```

##### Outputs

```
'127.0.0.1', 
3306, 
'edenjs_test', 
'root', 
null
```

---

<a name="getColumns"></a>

### getColumns

```
 this getColumns(String, String|array|function, Function);
```

Returns the columns and attributes given the table name

#### Parameters

  1. string - the name of the table

  2. string|array|function

  3. function - callback

#### Returns

 this

#### Example

##### Code

```
database.getColumns('eden_post', 
  ([1, 7, 'Take 5', 'You can work now']),
  function(error, row));

row;
```

##### Outputs

```
7
```

---

<a name="getRow"></a>

### getRow

```
 this getRow(String, String, String, Function);
```

Returns a 1 row result given the column name and the value

#### Parameters

  1. string - table

  2. string - name

  3. string - value

  4. function - callback

#### Returns

 this

#### Example

##### Code

```
database.getRow('eden_user', 'user_email', 'bob@gmail.com', function(error, row));
  row.user_name;

database.getRow('eden_user', 'user_email', 'dayle@gmail.com', function(error, row));
  row;
```

##### Outputs

```
'bobby'

null
```

---

<a name="insert"></a>

### insert

```
 eden/mysql/insert insert(String);
```

Returns the insert query builder

#### Parameters

  1. string

#### Returns

 eden/mysql/insert

#### Example

##### Code

```
var query = database.insert('user')
  .set('user_name', 'chris')
  .set('user_age', 21)
  .getQuery();

query = database.insert('user')
  .set('user_name', 'chris', 0)
  .set('user_age', 21, 0)
  .set('user_age', 22, 1)
  .getQuery();

query = database.insert('user')
  .set({user_name: 'chris', user_age: 21})
  .set({user_name: 'dan', user_age: 22}, 1)
  .getQuery();
```

##### Outputs

```
'INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21);'

'INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21), (?, 22);'

'INSERT INTO user (user_name, user_age) VALUES (\'chris\', 21), (\'dan\', 22)'
```

---

<a name="insertRow"></a>

### insertRow

```
 this insertRow(String, Object, Array|bool|null, Function);
```

Inserts data into a table and returns the ID

#### Parameters

  1. string - table

  2. object - setting

  3. array|bool|null

  4. function - callback

#### Returns

 this

#### Example

##### Code

```
database.insertRow('eden_user', {
  user_name: 'bob',
  user_email: 'bob@gmail.com',
  user_facebook: 123 });

row.insertId > 1;
```

##### Outputs

```
true
```

---

<a name="insertRows"></a>

### insertRows

```
 this insertRows(String, Object, Array|bool|null, Function);
```

Inserts multiple rows into a table

#### Parameters

  1. string - table

  2. object - settings

  3. array|bool|null

  4. function - callback

#### Returns

 this

#### Example

##### Code

```
database.insertRows('eden_user', [{
  user_name: 'bob',
  user_email: 'bob@gmail.com',
  user_facebook: 123
}, {
  user_name: 'chris',
  user_email: 'bob@gmail.com',
  user_facebook: 312 }]);

row.insertId > 1;
```

##### Outputs

```
true
```

---

<a name="model"></a>

### model

```
 eden/mysql/model model(String);
```

Returns model

#### Parameters

  1. string

#### Returns

 eden/mysql/model

#### Example

##### Code

```
database.model('eden_user')
  .setUserName('Bobby')
  .setUserEmail('bobby@gmail.com')
  .setUserFacebook(123);
model.setUserName('Billy').save(function(error, model, meta));
error;
```

##### Outputs

```
null
```

---

<a name="query"></a>

### query

```
 this query(String, Array, Function);
```

Queries the database

#### Parameters

  1. string - query

  2. array - binded value

  3. function - callback

#### Returns

 this

#### Example

##### Code

```
database.query('SELECT * FROM eden_user');

rows.length > 0;
```

##### Outputs

```
true
```

---

<a name="remove"></a>

### remove

```
 eden/mysql/delete remove(String);
```

Returns the delete query builder

#### Parameters

  1. string

#### Returns

 eden/mysql/delete

#### Example

##### Code

```
var query = database
  .remove('user')
  .where('user_id = ?')
  .getQuery();
```

##### Outputs

```
'DELETE FROM user WHERE user_id = ?;'
```

---

<a name="removeRows"></a>

### removeRows

```
 this removeRows(String, Array, Function);
```

Removes rows that match a filter

#### Parameters

  1. string - table

  2. array - filter

  3. function - callback

#### Returns

 this

#### Example

##### Code

```
database.removeRows('eden_user', 
  [['user_email = ?', 'bob@gmail.com']],
  function(error, row));

typeof row == 'object';
```

##### Outputs

```
true
```

---

<a name="select"></a>

### select

```
 eden/mysql/select select(String);
```

Returns the select query builder

#### Parameters

  1. string

#### Returns

 eden/mysql/select

#### Example

##### Code

```
var query = database.select('*')
  .from('user')
  .innerJoin('post', 'post_user=user_id', false)
  .where('user_name = ?')
  .sortBy('user_name')
  .groupBy('user_id')
  .limit(1, 2)
  .getQuery();

  query = database.select('*')
  .from('user')
  .leftJoin('post', 'post_user=user_id', false)
  .where('user_name = ?')
  .sortBy('user_name', 'DESC')
  .groupBy('user_id')
  .limit(1, 2)
  .getQuery();

query = database.select('*')
  .from('user')
  .rightJoin('post', 'post_user=user_id', false)
  .where('user_name = ?')
  .sortBy('user_name')
  .getQuery();

query = database.select('*')
  .from('user')
  .outerJoin('post', 'post_user')
  .where('user_name = ?')
  .groupBy('user_id')
  .limit(1, 2)
  .getQuery();
```

##### Outputs

```
'SELECT * FROM user INNER JOIN post ON (post_user=user_id) '
  + 'WHERE user_name = ? GROUP BY user_id ORDER BY user_name ASC LIMIT 1,2;'

'SELECT * FROM user LEFT JOIN post ON (post_user=user_id) '
  + 'WHERE user_name = ? GROUP BY user_id ORDER BY user_name DESC LIMIT 1,2;'

'SELECT * FROM user RIGHT JOIN post ON (post_user=user_id) '
  + 'WHERE user_name = ? ORDER BY user_name ASC;'

'SELECT * FROM user OUTER JOIN post USING (post_user) '
  + 'WHERE user_name = ? GROUP BY user_id LIMIT 1,2;'
```

---

<a name="search"></a>

### search

```
 eden/mysql/search search();
```

Returns search

#### Parameters

#### Returns

 eden/mysql/search

#### Example

##### Code

```
database.search('eden_user')
  .addFilter('user_name = ?', 'Christian Blanquera')
  .getRow(function(error, row, meta));
    row.user_email;

database.search('eden_post')
  .innerJoinOn('eden_user', 'post_user=user_id')
  .getRows(function(error, rows));
    rows.length;
```

##### Outputs

```
'cblanquera@gmail.com'

'number'
```

---

<a name="setRow"></a>

### setRow

```
 this setRow(String, String, String, Object, Function);
```

Sets only 1 row given the column name and the value

#### Parameters

  1. string - table

  2. string - name

  3. string - value

  4. object - setting

  5. function - callback

#### Returns

 this

#### Example

##### Code

```
database.setRow('eden_user', 'user_name', 'Christian Blanquera', {
  user_email: 'cblanquera@gmail.com'
}, function(error, row));

row.user_email;
```

##### Outputs

```
'cblanquera@gmail.com'
```

---

<a name="update"></a>

### update

```
 eden/mysql/update update(String);
```

Returns the update query builder

#### Parameters

  1. string

#### Returns

 eden/mysql/update

#### Example

##### Code

```
var query = database.update('user')
  .set('user_name', 'chris')
  .set('user_age', 21)
  .where('user_id = ?')
  .where('user_name = ?')
  .getQuery();

query = database.update('user')
  .set({user_name: 'chris', user_age: 21})
  .where(['user_id = ?', 'user_name = ?'])
  .getQuery();
```

##### Outputs

```
'UPDATE user SET user_name = \'chris\', user_age = 21 WHERE user_id = ? AND user_name = ?;'

'UPDATE user SET user_name = \'chris\', user_age = 21 WHERE user_id = ? AND user_name = ?;'
```

---

<a name="updateRows"></a>

### updatesRows

```
 this updateRows(String, Object, Array, Array|bool|null, Function);
```

Updates rows that match a filter given the update settings

#### Parameters

  1. string - table

  2. object - setting

  3. array - filter

  4. array|bool|null

  5. function - callback

#### Returns

 this

#### Example

##### Code

```
database.updateRows('eden_user', {
  user_name: 'bobby'
}, [['user_email = ?, 'bob@gmail.com']]);

typeof row == 'object';
```

##### Outputs

```
true
```
