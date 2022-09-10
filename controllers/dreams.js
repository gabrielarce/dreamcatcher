// Where did this come from?? Don't remember, but leaving it untill i find out
// const { ObjectId } = require('mongodb')
const Dream = require('../models/Dream')

module.exports = {
    getDreams: async(request, response) => {
        const dreams = await Dream.find({})
        console.log(dreams)
        response.render('demoDashboard', { dreams })
    },
    getFullDream: async(request, response) => {
        const dream = await Dream.findById(request.params.id)
        console.log(dream)
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
        console.log(request.body.dreamIdFromJSFile)
        try {
            await Dream.findOneAndDelete({ _id: request.body.dreamIdFromJSFile })
            console.log('Deleted Dream')
                // response.json('Deleted It')
            response.redirect('/api/dreams/')
        } catch (err) {
            console.log(err)
        }
    }
}