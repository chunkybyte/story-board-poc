const express = require('express');
const router = express.Router();

/**
 * @description Login/Landing Page
 * @listens     GET /
 */
router.get(
    '/',
    (req, res)  => {
        res.send('Login Already!');
    }
);

/**
 * @description Dashboard Page
 * @listens     GET /dashboard
 */
router.get(
    '/dashboard',
    (req, res)  => {
        res.send('Dashboard');
    }
);

module.exports = router;