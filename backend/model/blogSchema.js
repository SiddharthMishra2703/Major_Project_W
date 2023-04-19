const mongooose = require('mongoose');
const {commentSchema} = require("./commentSchema");

const blogSchema = new mongooose.Schema({
    title: {
        type: String,
        required:true
    },
    content: {
         type: String,
        required:true
    },
    topic: {
        type: String,
        required:true
    },
    likes: {
        type: Number
    },
    date : {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema]
})

// collection creation
const Blog = mongooose.model('BLOG', blogSchema);

module.exports = { blogSchema,
    Blog
}