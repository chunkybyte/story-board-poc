const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

/**
 * @description Login/Landing Page
 * @listens     GET /
 */
router.get(
    '/',
    ensureGuest,
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
    ensureAuth,
    (req, res)  => {
        res.render('dashboard', {
            user: req.user.firstName
        });
    }
);

module.exports = router;