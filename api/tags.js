const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db");
tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const allPosts = await getPostsByTagName(tagName);

    const posts = allPosts.filter((post) => {
      if (post.active) {
        return true;
      }

      if (req.user && post.author_id === req.user.id) {
        return true;
      }

      return false;
    });

    res.send({
      posts: posts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
