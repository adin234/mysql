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
mysql().collection();
```

##### Outputs

```
RESULTS
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
mysql().connect();
```

##### Outputs

```
RESULTS
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
mysql().getConnection();
```

##### Outputs

```
RESULTS
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
mysql().getColumns();
```

##### Outputs

```
RESULTS
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
mysql().getRow();
```

##### Outputs

```
RESULTS
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
mysql().insert();
```

##### Outputs

```
RESULTS
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
mysql().insertRow();
```

##### Outputs

```
RESULTS
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
mysql().insertRows();
```

##### Outputs

```
RESULTS
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
mysql().model();
```

##### Outputs

```
RESULTS
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
mysql().query();
```

##### Outputs

```
RESULTS
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
mysql().remove();
```

##### Outputs

```
RESULTS
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
mysql().removeRows();
```

##### Outputs

```
RESULTS
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
mysql().select();
```

##### Outputs

```
RESULTS
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
mysql().search();
```

##### Outputs

```
RESULTS
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
mysql().setRow();
```

##### Outputs

```
RESULTS
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
mysql().update();
```

##### Outputs

```
RESULTS
```

---

<a name="updateRows"></a>

### updateRows

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
mysql().updateRows();
```

##### Outputs

```
RESULTS
```
