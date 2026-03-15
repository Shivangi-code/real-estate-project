const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  type: String,
  subType: String,
  constructionStatus: String,
  description: String,
  image: String,

  status: {
    type: String,
    default: "pending",   
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",          
  },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);