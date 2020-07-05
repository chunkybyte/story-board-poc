const express = require('express');
const router = express.Router();

/**
 * @description Login/Landing Page
 * @listens     GET /
 */
router.get(
    '/',
    (req, res)  => {
        res.render('login', {
            layout: 'guest'
        });
    }
);

/**
 * @description Dashboard Page
 * @listens     GET /dashboard
 */
router.get(
    '/dashboard',
    (req, res)  => {
        res.render('dashboard');
    }
);

module.exports = router;