const mongoose = require('mongoose')
const commentSchema = require('../model/Comment').schema

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 35,
        max: 100
    },
    intro: {
        type: String,
        required: true,
        min:120,
        max:340
    },
    content: {
        type: String,
        required: true,
        min: 1000
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [commentSchema],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema)