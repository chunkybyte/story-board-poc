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

/**
 * @description Get Story 
 * @listens     GET /stories/:id
 */
router.get(
    '/:id',
    ensureAuth,
    async (req, res)  => {
        try {
            const story = await Story.findById( req.params.id )
                .populate('user')
                .lean();
            
            if (!story) {
                return res.render('errors/404');
            }

            res.render('stories/show', {
                story
            });
        } catch (err) {
            console.log(err);
            return res.render('errors/404');
        }
    }
);

/**
 * @description Edit a Story Page
 * @listens     GET /stories/edit/:id
 */
router.get(
    '/edit/:id',
    ensureAuth,
    async (req, res)  => {
        try {
            const story = await Story.findOne({ 
                _id: req.params.id
            }).lean();

            if (!story) {
                return res.render('errors/404');
            }

            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {
                    story
                });
            }
            
        } catch (err) {
            console.log(err);
            res.render('errors/500');
        }

    }
);


/**
 * @description Update Story Page
 * @listens     PUT /stories/:id
 */
router.put(
    '/:id',
    ensureAuth,
    async (req, res)  => {
        try {
            let story = await Story.findById(req.params.id).lean();

            if (!story) {
                return res.render('errors/404');
            }

            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                story = await Story.findOneAndUpdate( { _id: req.params.id }, req.body, {
                    new: true,
                    runValidators: true
                });

                res.redirect('/dashboard');
            }

        } catch (err) {
            console.log(err)
            res.render('errors/500'); 
        }
        
    }
);

/**
 * @description Delete Story
 * @listens     DELETE /stories/:id
 */
router.delete(
    '/:id',
    ensureAuth,
    async (req, res)  => {
        try {
          await Story.remove( { _id: req.params.id });
          res.redirect('/dashboard');  
        } catch (error) {
            console.log(error);
            return res.render('errors/500');
        }
    }
);

/**
 * @description Get User's Stories
 * @listens     GET /stories/user/:userId
 */
router.get(
    '/user/:userId',
    ensureAuth,
    async (req, res)  => {
        try {
            const stories = await Story.find( { 
                user    : req.params.userId,
                status  : 'public'
            } )
            .populate('user')
            .lean();

            res.render('stories/index', {
                stories
            })
            
        } catch (err) {
            console.log(err);
            return res.render('errors/404');
        }
    }
);

module.exports = router;