# arraySqlQuerry
Simple array based sql function in JavaScript with Transactions


# How to Use
- mysql package must be added to project.json
- input is array of string or function that returns string
- string must be valid sql query
- function is callback that as its first argument takes output array of previous sql queries must return string
- example
- returns array [ output: Array of Object/s, errors: Array Of Error/s ]

* Example
  ```javascript
  const sql1 = 'select * from fruits WHERE rotten = 1'
  const sql2 = ( output ) => {
    const rottenFruits = output[0] // result from sql1 query
    const arrayOfPKToRemove = []
    fruits.forEach( fruit=>arrayOfIdToRemove.push(fruit.Private_Key) )
    return removeAllPrivateKeys(arrayOfPKToRemove) // function that will create delete query string for each key in array
    // example output: DELETE FROM fruits WHERE Private_Key = 1 OR Private_Key = 7
  }
  const {output, errors} = query( [sql1, sql2] )
  // output[0]: Array Of Rotten Fruits
  // output[1]: Array Of Sql Result (affected rows 2 basing on example)
  ```
