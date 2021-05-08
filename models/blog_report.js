const mongoose = require("mongoose");
const {Schema} = require('mongoose');
const { ObjectId } = require('mongodb');

var blogReportSchema = new mongoose.Schema({
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'Blog'},
    sentence: {type: String},
    classification: {type: Object}
}, {timestamps: true} );

blogReportSchema.statics.listAllBlogReports = function() {
    return this.find({}).exec();
};

blogReportSchema.statics.fetchBlogReport = function(blogId) {
    return this.find({ blog: blogId});
};

blogReportSchema.statics.deleteBlogReports = function(blogId) {
    return this.deleteMany({ blog: blogId }).exec();
}

var blogReportModel = mongoose.model('BlogReport', blogReportSchema);

module.exports = blogReportModel;
