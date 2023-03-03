import {createPool, Pool} from 'mysql2';

/**
 * If you would like to run the inserts asynchronously, you will want createPool.
 * Because in with createConnection, there is only 1 connection and all queries
 * executed on that connection are queued, and that is not really asynchronous.
 * (Async from node.js perspective, but the queries are executed sequentially)
 * @type {Pool}
 */
const mySqlTestConnection: Pool = createPool({
  host: process.env.MYSQL_HOST_STAGE,
  user: process.env.MYSQL_USER_STAGE,
  password: process.env.MYSQL_PASSWORD_STAGE,
  database: process.env.MYSQL_DB_STAGE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // socketPath:
  //   process.env.NODE_ENV !== 'production' ? '' : process.env.MYSQL_SOCKET_STAGE,
});

const mySqlProdConnection: Pool = createPool({
  host: process.env.MYSQL_HOST_PROD,
  user: process.env.MYSQL_USER_PROD,
  password: process.env.MYSQL_PASSWORD_PROD,
  database: process.env.MYSQL_DB_PROD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // socketPath:
  //   process.env.NODE_ENV !== 'production' ? '' : process.env.MYSQL_SOCKET_PROD,
});

// TODO: When ready uncomment this and use the prod db
export const mySqlConnection =
  process.env.NODE_ENV !== 'production'
    ? mySqlTestConnection.promise()
    : mySqlProdConnection.promise();

/**
 * Example of query on pre-existing database
 */

// const query = `# SELECT * FROM users`;
// const [rows] = await connection.execute(query, [limit]);
