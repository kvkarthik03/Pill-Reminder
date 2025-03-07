const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ 
        message: 'API is working',
        time: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

module.exports = router;
