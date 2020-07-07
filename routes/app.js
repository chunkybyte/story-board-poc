const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story');

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
    async (req, res)  => {
        try {
            const stories = await Story.find({ user: req.user.id }).lean();
            
            res.render('dashboard', {
                user: req.user.firstName,
                stories
            });
        } catch (err) {
            console.log('Error fetching stories: ', err);
            res.render('error/500');
        }
    }
);

module.exports = router;