const mongoose = require("mongoose");
const {Schema} = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'Title is required!']},
    content: {type: String, required: [true, 'Content is required!']},
}, {timestamps: true} );

blogSchema.statics.listAllBlogs = function() {
    return this.find({ $or: [ { title: { $ne: null } }, { content: { $ne: null } }]}).exec();
};

var blogModel = mongoose.model('Blog', blogSchema);

module.exports = blogModel;
