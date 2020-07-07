const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Story = require('../models/Story');

/**
 * @description Add Story Page
 * @listens     GET /stories/add
 */
router.get(
    '/add',
    ensureAuth,
    (req, res)  => {
        res.render('stories/add');
    }
);

/**
 * @description Process added story
 * @listens     GET /stories/add
 */
router.post(
    '/',
    ensureAuth,
    async (req, res)  => {
        try {
            req.body.user = req.user.id;
            await Story.create(req.body);
            res.redirect('/dashboard');
        } catch (err) {
            console.log(err);
            res.render('error/500');
        }
    }
);

/**
 * @description Show all stories
 * @listens     GET /stories
 */
router.get(
    '/',
    ensureAuth,
    async (req, res)  => {
        try {
            const stories = await Story.find({ status: 'public' })
                .populate('user')
                .sort({ createdAt: 'desc' })
                .lean();

                res.render('stories/index', {
                    stories
                });
        } catch (err) {
            consoele.log(err);
            res.render('error/500');
        }
    }
);

module.exports = router;