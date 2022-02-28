const mongoose = require("mongoose");

const user = new mongoose.Schema({
  id: {
    type: String,
  },

  name: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", user);
