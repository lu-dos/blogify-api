const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Titre et contenu sont requis" });
    }

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "active" })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email",
    );

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès Refusé" });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.status === "deleted") {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès Refusé" });
    }

    post.status = "deleted";
    await post.save();

    res.status(200).json({ message: "Post Supprimé" });
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
