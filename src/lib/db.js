// lib/db.js
import mysql from 'mysql2/promise';

export async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12777440',
    password: 'ZRwvWap9SU', // Replace with real password
    database: 'sql12777440',
  });

  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end();
  }
}