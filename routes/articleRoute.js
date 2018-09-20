const express = require('express');
const router = express.Router();
const Article = require('../models/Articles');
const User = require('../models/User');

/**
 * @route       /article/add
 * @method      GET
 * @description Show add article page
 */
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('articles/add_article', {
        header: 'Add Article'
    });
});

/**
 * @route       /article/add
 * @method      POST 
 * @description Add New Article
 */
router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is required!').notEmpty();
    req.checkBody('body', 'Body is required!').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.render('articles/add_article', {
            header: 'Add Article',
            errors
        });
    }
    else {
        let newArticle = new Article({
            title: req.body.title,
            author: req.user._id,
            body: req.body.body
        });
        newArticle.save()
            .then(article => {
                req.flash('success', 'Article Posted');
                res.redirect(`/article/${article._id}`);
            })
            .catch(err => console.error(err));
    }
});

/**
 * @route       /article/edit/:id
 * @method      GET 
 * @description Show edit article page by id
 */
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
            if (article.author != req.user._id) {
                req.flash('danger', 'Not authorized');
                return res.redirect('/');
            }

            res.render('articles/edit_article', {
                header: 'Edit Article',
                article
            });
        })
        .catch(err => console.error(err));
});

/**
 * @route       /article/edit/:id
 * @method      POST
 * @description Update Article
 */
router.post('/edit/:id', (req, res) => {
    let article = {
        title: req.body.title,
        body: req.body.body
    };

    Article.findByIdAndUpdate(req.params.id, article, { new: true })
        .then(article => {
            req.flash('success', 'Article Updated');
            res.redirect(`/article/${article._id}`);
        })
        .catch(err => console.error(err));
});

/**
 * @route       /article/delete/:id
 * @method      DELETE
 * @description Delete Article by id
 */
router.delete('/delete/:id', (req, res) => {
    if (!req.user._id) {
        return res.status(500).send();
    }

    Article.findById(req.params.id)
        .then(article => {
            if (article.author != req.user._id) {
                res.status(500).send();
            }
            else {
                Article.findByIdAndDelete(req.params.id)
                    .then(() => res.send('200'))
                    .catch(err => console.error(err));
            }
        })
        .catch(err => console.error(err))
});

/**
 * @route       /article/:id
 * @method      GET
 * @description Get single article by ud
 */
router.get('/:id', (req, res) => {
    Article.findById(req.params.id)
        .populate({ path: 'author', select: 'name' })
        .then(article => res.render('articles/article', { article }))
        .catch(err => console.error(err));
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash('danger', 'Please login first');
        res.redirect('/auth/login');
    }
}

module.exports = router;