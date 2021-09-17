const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
} = require("./index");

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");

    await createPost({
      author_id: albert.id,
      title: "First Post",
      content: "This is my first post here",
    });

    await createPost({
      author_id: sandra.id,
      title: "Sandra's First Post",
      content: "Sandra's First post content here",
    });

    await createPost({
      author_id: glamgal.id,
      title: "Glamgal's First Post",
      content: "This is Glamgal's first post",
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      username: "albert",
      password: "bertie99",
      name: "Albert",
      location: "New Orleans",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Sandra",
      location: "Metairie",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Carey",
      location: "Norco",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");
    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);
    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);
    console.log("Calling updatePost on post[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);
    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);
    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`
    CREATE TABLE tags (id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL);
    CREATE TABLE post_tags (post_id  UNIQUE INTEGER REFERNCES  posts(id), tag_id UNIQUE INTEGER REFERENCES  tags(id), );
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts (id SERIAL PRIMARY KEY, author_id INTEGER REFERENCES users(id), title VARCHAR(255) NOT NULL, content TEXT NOT NULL, active BOOLEAN DEFAULT true
      );
      
      

    `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}
rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
