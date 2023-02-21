const cloudinary = require("../middleware/cloudinary");
const Dream = require("../models/Dream");
const Comment = require("../models/Comment");

module.exports = {
  getDreams: async (req, res) => {
    try {
      const allDreams = await Dream.find({ user: req.user.id });
      const totalRecords = await Dream.find({ user: req.user.id })
        .countDocuments()
        .exec();
      let perPage = 10;
      let page = req.query.page || 1;
      let totalPages = Math.ceil(totalRecords / perPage);
      let skip = (page - 1) * perPage;
      const dreams = await Dream.find({ user: req.user.id })
        .sort({ date: -1 })
        .skip(skip)
        .limit(perPage)
        .exec((err, records) => {
          console.log(allDreams);
          res.render("dashboard", {
            data: allDreams,
            dreams: records,
            currentPage: page,
            totalPages: totalPages,
          });
        });
    } catch (error) {
      throw error;
    }
  },
  getDreamLand: async (req, res) => {
    const dreams = await Dream.find({ public: true }).lean().sort({ date: -1 });
    res.render("dreamLand", { dreams });
  },
  getFullDream: async (req, res) => {
    const dream = await Dream.findById(req.params.id);
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: "desc" })
      .lean();
    res.render("dreamFull", { dream, comments });
  },
  postDream: async (req, res) => {
    try {
      if (!req.file) {
        await Dream.create({
          rating: req.body.rating,
          lucid: req.body.lucid,
          story: req.body.story,
          title: req.body.title || "untitled dream",
          dateAlias: req.body.date,
          date: req.body.date,
          image:
            "https://res.cloudinary.com/dd55v5j4d/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1664348839/javardh-2q6C5zDJOsg-unsplash_bvvzug.jpg",
          user: req.user.id,
          public: req.body.public,
        });
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
          public: req.body.public,
        });
      }
      console.log("Dream has been added to the dashboard!");
      res.redirect("/api/dreams/");
    } catch (err) {
      console.log(err);
    }
  },
  getDreamForm: async (req, res) => {
    res.render("dreamForm");
  },
  deleteDream: async (req, res) => {
    try {
      let dream = await Dream.findById({ _id: req.params.id });

      if (!dream.cloudinaryId) {
        await dream.deleteOne({ _id: req.params.id });
        console.log("Deleted Dream");
        res.redirect("/api/dreams/");
      } else {
        await cloudinary.uploader.destroy(dream.cloudinaryId);
        await dream.deleteOne({ _id: req.params.id });
        console.log("Deleted Dream");
        res.redirect("/api/dreams/");
      }
    } catch (err) {
      console.log(err);
    }
  },
  getEdit: async (req, res) => {
    try {
      const dream = await Dream.findOne({
        _id: req.params.id,
      }).lean();

      res.render("dreamEdit", {
        dream,
      });
    } catch (err) {
      console.error(err);
      // return res.render('error/500')
    }
  },
  editDream: async (req, res) => {
    try {
      await Dream.findOneAndUpdate(
        { _id: req.params.id },
        {
          rating: req.body.rating,
          lucid: req.body.lucid,
          story: req.body.story,
          title: req.body.title,
          date: req.body.date,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.redirect(`/api/dreams/fullDream/${req.params.id}`);
    } catch (err) {
      console.error(err);
      // return res.render('error/500')
    }
  },
};
