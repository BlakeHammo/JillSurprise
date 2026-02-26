const express = require('express');
const router = express.Router();

// POST /api/auth  — verify admin password
router.post('/', (req, res) => {
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ success: false, error: 'ADMIN_PASSWORD is not configured on the server.' });
  }

  if (password && password === adminPassword) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: 'Incorrect password.' });
});

module.exports = router;
