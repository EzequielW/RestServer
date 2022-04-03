const express = require('express')
const router = express.Router()
const Post = require('../model/Post')
const verify = require('./verifyToken')
const { multerUpload, dataURI } = require('../multerConfig')
const { cloudinaryConfig, uploader } = require('../cloudinaryConfig')
const commentsRouter = require('./comments')

router.use('/:postId/comments', commentsRouter)

router.get('/', async (req, res) => {
    try{
        const page = req.query.page ? Number(req.query.page) : 1;
        const per_page = req.query.per_page ? Number(req.query.per_page) : 20;
        const result = await Post.paginate(page, per_page);
        console.log(result);
        res.status(200).json(result);
    } catch (err){
        res.status(400).send(err)
    }
})

router.get('/:postId', async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId)
        res.json(post)
        res.end()
    } catch(err){
        res.status(400).send(err)
    }
})

router.post('/', verify, multerUpload, async (req, res) =>{
    try{
        const file = dataURI(req);

        uploader.upload(file).then(async (result) => {
            const post = new Post({
                title: req.body.title,
                intro: req.body.intro,
                content: req.body.content,
                author_id: req.body.author_id,
                imgPreview: result.url
            })

            try{
                const savedPost = await post.save()
                res.json(savedPost)
                res.end()
            } catch (err){
                res.status(400).send(err)
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send(err);
        });
    } catch(err){
        console.error(err);
        res.status(500).send(err);
    }
})

router.delete('/:postId', verify, async (req, res) => {
    try{
        const removedPost = await Post.remove({ _id: req.params.postId })
        res.json(removedPost)
        res.send()
    } catch(err){
        res.status(400).send(err)
    }
})

router.patch('/:postId', verify, async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId }, 
            { $set: { title: req.body.title } }
        )
        res.json(updatedPost)
        res.end()
    } catch(err){
        res.status(400).send(err)
    }
})

module.exports = router

