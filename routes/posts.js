const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const verify = require('./verifyToken');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../imageUpload/'));
    },
    filename: function (req, file, cb) {
        cb(null, (crypto.createHash('md5').update(file.originalname, 'utf8').digest("hex")).toString() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    }
});

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find().populate('author_id');
        res.json(posts);
        res.end();
    } catch (err){
        res.status(400).send(err);
    }
});

router.get('/:postId', async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
})

router.post('/', verify, upload.single('file'), async (req, res) =>{
    const post = new Post({
        title: req.body.title,
        intro: req.body.intro,
        content: req.body.content,
        author_id: req.body.author_id,
        imgPreview: req.file.filename
    });    

    try{
        const savedPost = await post.save();
        res.json(savedPost);
        res.end();
    } catch (err){
        res.status(400).send(err);
    }
});

router.delete('/:postId', verify, async (req, res) => {
    try{
        const removedPost = await Post.remove({ _id: req.params.postId });
        res.json(removedPost);
        res.send();
    } catch(err){
        res.status(400).send(err);
    }
})

router.patch('/:postId', verify, async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId }, 
            { $set: { title: req.body.title } }
        );
        res.json(updatedPost);
        res.end();
    } catch(err){
        res.status(400).send(err);
    }
})

module.exports = router

