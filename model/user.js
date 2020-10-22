const mongoose = require("mongoose");

// define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  age: {
    type: Number,
    min: 10,
    max: 100,
  },
  password: String,
  hobbies: [String],
  email: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
