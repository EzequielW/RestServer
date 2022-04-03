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
    imgPreview: {
        type: String,
        required: true
    },
    comments: [commentSchema],
    date: {
        type: Date,
        default: Date.now
    }
})

PostSchema.statics.paginate = async function(page, limit) {
    try{
        if(limit > 20){
            limit = 20;
        }
        const skip =  limit * (page - 1);
        const totalCount = await this.countDocuments();
        const posts = await this.find().skip(skip).limit(limit).populate('author_id');
        const pages = Math.ceil(totalCount / limit);

        const result = {
            'totalPages': pages,
            'page': page,
            'posts': posts
        }
        return result;
    } catch(err){
        console.error(err);
        throw new Error(err);
    }
};

module.exports = mongoose.model('Post', PostSchema)