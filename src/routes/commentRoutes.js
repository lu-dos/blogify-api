const express = require('express');
const {
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;