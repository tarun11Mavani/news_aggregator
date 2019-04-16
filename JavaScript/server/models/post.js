const mongoose = require('mongoose');

const Post = mongoose.model('Post', {
    handle: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    dislikes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    reports: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    tags: [[]],
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = { Post };
