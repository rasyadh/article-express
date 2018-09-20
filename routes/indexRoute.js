const express = require('express');
const router = express.Router();
const Article = require('../models/Articles');
const User = require('../models/User');

router.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

/**
 * @route       /
 * @method      GET
 * @description Get all article
 */
router.get('/', (req, res) => {
    Article.find()
        .populate({ path: 'author', select: 'name' })
        .then(articles => {
            res.render('articles/index', {
                header: 'Articles',
                articles
            });
        })
        .catch(err => console.error(err));
});

module.exports = router;