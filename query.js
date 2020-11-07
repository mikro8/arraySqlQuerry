const mysql = require("mysql");
const util = require("util");

const params = {
  host: 'ip or host',
  user: 'username',
  password: 'password123',
  database: "database",
};

function makeDb() {
  const connection = mysql.createConnection(params);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
    beginTransaction() {
      return util.promisify(connection.beginTransaction).call(connection);
    },
    commit() {
      return util.promisify(connection.commit).call(connection);
    },
    rollback() {
      return util.promisify(connection.rollback).call(connection);
    },
  };
}

const query = async (sql, onError) => {
  const db = makeDb();
  let output = [];
  let errors = [];
  if (Array.isArray(sql)) {
    await db.beginTransaction();
    try {
      for (let i = 0; i < sql.length; i++) {
        if (typeof sql[i] === "string") {
          const result = await db.query(sql[i]);
          output[i] = result;
        } else if (typeof sql[i] === "function") {
          const sqlReturn = sql[i](output);
          if (sqlReturn) {
            const result = await db.query(sqlReturn);
            output[i] = result;
          } else {
            throw "ERROR";
          }
          // console.log(sqlReturn);
        }
      }
      await db.commit();
    } catch (err) {
      console.log(err);
      onError(err);
      await db.rollback();
      output = [];
      errors.push({ err });
    } finally {
      await db.close();
    }
  }
  return { output, errors };
};

module.exports = {
  query,
};
