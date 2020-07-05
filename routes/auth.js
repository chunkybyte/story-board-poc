const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @description Authenticate with Google
 * @listens     GET /auth/google
 */
router.get(
    '/google', 
    passport.authenticate('google', { scope: ['profile'] })
);

/**
 * @description Google Auth Callback
 * @listens     GET /auth/google/callback
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

module.exports = router;