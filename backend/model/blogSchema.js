const mongooose = require('mongoose');

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
    }
})

// collection creation
const Blog = mongooose.model('BLOG', blogSchema);

module.exports = { blogSchema,
    Blog
}