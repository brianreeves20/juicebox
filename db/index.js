const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Abedith1990",
  database: "juiceboxdev",
  port: 3000,
});

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
   SELECT id, username, name, location, active FROM users WHERE id=${userId}
   `);
    if (!user) {
      return null;
    }
    user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
    SELECT * FROM posts WHERE author_id=${userId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(
      `SELECT * FROM posts;
      `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [post],
    } = await client.query(
      `
    UPDATE posts SET ${setString} WHERE id=${id} RETURNING *;
    `,
      Object.values(fields)
    );
    return post;
  } catch (error) {
    throw error;
  }
}

async function createPost({ author_id, title, content }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      INSERT INTO posts(author_id, title, content)
      VALUES ($1, $2, $3)
      
      RETURNING *;
      `,
      [author_id, title, content]
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    UPDATE users SET ${setString} WHERE id=${id} RETURNING *;
    `,
      Object.values(fields)
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `SELECT id, username, name, location, active
      FROM users;
    `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
};
