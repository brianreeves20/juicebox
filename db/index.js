const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Abedith1990",
  database: "juiceboxdev",
  port: 3000,
});

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username 
      FROM users;
    `
  );

  return rows;
}

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `,
      [username, password]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { client, getAllUsers, createUser };
