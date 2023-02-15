const cloudinary = require("../middleware/cloudinary");
const User = require("../models/Users");

module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      console.log(user);
      res.render("user", { user });
    } catch (err) {
      throw err;
    }
  },
};
