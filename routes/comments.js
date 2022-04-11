const express = require('express')
const verify = require('./verifyToken')
const router = express.Router({ mergeParams: true })
const Post = require('../model/Post')
const Comment = require('../model/Comment')

router.post('/', verify, async (req, res) => {
    const comment = new Comment({
        author: req.user._id,
        authorName: req.user.username,
        message: req.body.message
    })

    try{
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId }, 
            { $push: { comments: comment } }
        )
        res.json(updatedPost)
        res.end()
    } catch(err){
        res.status(400).send(err)
    }
})

module.exports = router