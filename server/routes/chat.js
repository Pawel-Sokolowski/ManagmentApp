const express = require('express');
const router = express.Router();

// Placeholder routes for remaining modules
router.get('/', (req, res) => {
  res.json({ message: 'Chat module - API endpoint ready' });
});

module.exports = router;