const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "active" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email",
    );

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.status = "deleted";
    await post.save();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
