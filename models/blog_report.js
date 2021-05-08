const mongoose = require("mongoose");
const {Schema} = require('mongoose');

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

var blogReportModel = mongoose.model('BlogReport', blogReportSchema);

module.exports = blogReportModel;
