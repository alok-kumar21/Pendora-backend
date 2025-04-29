const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    images: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categories", categorySchema);

module.exports = Categories;
