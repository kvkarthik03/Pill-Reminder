const express = require('express');
const router = express.Router();
const { chatResponse } = require('../controllers/chatController');

// Debug middleware
router.use((req, res, next) => {
    console.log('Chat Route accessed:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

// POST endpoint for chat
router.post('/', chatResponse);

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Chat route is working' });
});

module.exports = router;
