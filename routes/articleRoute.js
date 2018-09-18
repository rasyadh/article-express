const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

/**
 * @route       /article/add
 * @method      GET
 * @description Show add article page
 */
router.get('/add', (req, res) => {
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
    req.checkBody('title', 'Title is required!').notEmpty(),
    req.checkBody('author', 'Author is required!').notEmpty(),
    req.checkBody('body', 'Body is required!').notEmpty()

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
            author: req.body.author,
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
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
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
        author: req.body.author,
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
    Article.findByIdAndDelete(req.params.id)
        .then(() => res.send('200'))
        .catch(err => console.error(err));
});

/**
 * @route       /article/:id
 * @method      GET
 * @description Get single article by ud
 */
router.get('/:id', (req, res) => {
    Article.findById(req.params.id)
        .then(article => res.render('articles/article', { article }))
        .catch(err => console.error(err));
});

module.exports = router;