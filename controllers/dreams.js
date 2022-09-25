// Where did this come from?? Don't remember, but leaving it untill i find out
// const { ObjectId } = require('mongodb')
const Dream = require('../models/Dream')

module.exports = {
    getDreams: async(request, response) => {
        const dreams = await Dream.find({})
        response.render('demoDashboard', { dreams })
    },
    getFullDream: async(request, response) => {
        const dream = await Dream.findById(request.params.id)
        response.render('dreamFull', { dream })
    },
    postDream: async(request, response) => {
        try {
            const dream = new Dream({
                rating: request.body.rating,
                lucid: request.body.lucid,
                story: request.body.story,
                title: request.body.title || "untitled",
                date: request.body.date
            })
            await Dream.create(dream)
            console.log('Dream has been added!')
            response.redirect('/api/dreams/')
        } catch (err) {
            console.log(err)
        }
    },
    getDreamForm: async(request, response) => {
        response.render('dreamForm')
            // response.redirect('/api/dreams/dreamForm')
    },
    deleteDream: async(request, response) => {
        try {
            await Dream.findOneAndDelete({ _id: request.body.dreamIdFromJSFile })
            console.log('Deleted Dream')
                // response.json('Deleted It')
            response.redirect('/api/dreams/')
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
            // let dream = await Dream.findOne({
            //     _id: req.params.id,
            // }).lean()

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