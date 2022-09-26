const cloudinary = require("../middleware/cloudinary");
const Dream = require('../models/Dream')

module.exports = {
    getDreams: async(req, res) => {
        const dreams = await Dream.find({ user: req.user.id }).lean().sort({ date: -1 })
        res.render('dashboard', { dreams })
    },
    getFullDream: async(req, res) => {
        const dream = await Dream.findById(req.params.id)
        res.render('dreamFull', { dream })
    },
    postDream: async(req, res) => {
        try {
            if (!req.file) {
                await Dream.create({
                    rating: req.body.rating,
                    lucid: req.body.lucid,
                    story: req.body.story,
                    title: req.body.title || "untitled",
                    date: req.body.date,
                    image: "https://res.cloudinary.com/dd55v5j4d/image/upload/v1663913154/cld-sample-2.jpg",
                    user: req.user.id,
                })
            } else {
                // Upload image to cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);

                await Dream.create({
                    rating: req.body.rating,
                    lucid: req.body.lucid,
                    story: req.body.story,
                    title: req.body.title || "untitled",
                    date: req.body.date,
                    image: result.secure_url,
                    cloudinaryId: result.public_id,
                    user: req.user.id,
                })
            }
            console.log('Dream has been added to the dashboard!')
            res.redirect('/api/dreams/')
        } catch (err) {
            console.log(err)
        }
    },
    getDreamForm: async(req, res) => {
        res.render('dreamForm')
    },
    deleteDream: async(req, res) => {
        try {
            await Dream.findOneAndDelete({ _id: req.params.id })
            console.log('Deleted Dream')
            res.redirect('/api/dreams/')
        } catch (err) {
            console.log(err)
        }
    },
    getEdit: async(req, res) => {
        try {
            const dream = await Dream.findOne({
                _id: req.params.id,
            }).lean()

            // if (!story) {
            //     return res.render('error/404')
            // }

            // if (story.user != req.user.id) {
            //     res.redirect('/stories')
            // } else {
            //     res.render('stories/edit', {
            //         story,
            //     })
            // }
            res.render('dreamEdit', {
                dream,
            })

        } catch (err) {
            console.error(err)
                // return res.render('error/500')
        }
    },
    editDream: async(req, res) => {
        try {
            await Dream.findOneAndUpdate({ _id: req.params.id }, {
                rating: req.body.rating,
                lucid: req.body.lucid,
                story: req.body.story,
                title: req.body.title,
                date: req.body.date,
            }, {
                new: true,
                runValidators: true,
            })

            res.redirect(`/api/dreams/fullDream/${req.params.id}`)

        } catch (err) {
            console.error(err)
                // return res.render('error/500')
        }
    },
}