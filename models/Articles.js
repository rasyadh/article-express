const mongoose = require('mongoose');

// Article Schema
let articlesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    }
});

let Articles = module.exports = mongoose.model('Articles', articlesSchema);