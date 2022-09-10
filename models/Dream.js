const mongoose = require('mongoose')

const DreamSchema = new mongoose.Schema({
    rating: {
        type: String,
        required: true,
    },
    lucid: {
        type: Boolean,
        default: false,
    },
    story: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "untitled",
        trim: true,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    // status: {
    //     type: String,
    //     default: 'public',
    //     enum: ['public', 'private'],
    // },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     //!Change: this field should be required because the app will break if the user is not present.
    //     required: true,
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Dream', DreamSchema)