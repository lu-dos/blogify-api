const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
