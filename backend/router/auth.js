const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");


require('../db/conn');
const User = require("../model/userSchema");

const {blogSchema ,Blog} = require("../model/blogSchema");

// router.get('/', (req, res) => {
//     res.send(`Hello world from the server rotuer js`);
// });

// register route

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword} = req.body;
    
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz filled the field properly" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
             return res.status(422).json({ error: "Email already Exist" });
        } else if (password != cpassword) {
             return res.status(422).json({ error: "password are not matching" });
        } else {
             const user = new User({ name, email, phone, work, password, cpassword });
            await user.save();
            res.status(201).json({ message: "user registered successfuly" });
        }
        
  
    } catch (err) {
        console.log(err);
    }

});

// login route 

router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error:"Plz Filled the data"})
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);   

        if (!isMatch) {
            res.status(400).json({ error: "Invalid Credientials " });
        } else {
             // need to genereate the token and stored cookie after the password match 
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly:true
            });
            
            res.json({ message: "user Signin Successfully" });
        }
        } else {
             res.status(400).json({ error: "Invalid Credientials " });
        }

    } catch (err) {
        console.log(err);
    }
});


// dashboard route 

router.get('/Dashboard', authenticate ,(req, res) => {
    res.send(req.rootUser);
});


// Logout route

router.get('/logout', (req, res) => {
    console.log(`Hello my Logout Page`);
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User lOgout');
});


// Blog writing blog

router.post('/writeblog', authenticate, async (req, res) =>{

    const { title, content, topic} = req.body;
    
    if (!title || !content || !topic) {
        return res.status(422).json({ error: "Plz filled the field properly" });
    }

    try{

        const blog = new Blog({ title, content, topic}); 
        const foundUser = await User.findOne({ _id: req.rootUser._id });
        foundUser.blogs.push(blog);
        await foundUser.save();
        await blog.save();
        res.status(201).json({ message: "blog saved successfuly" });
    
  
    } catch (err) {
        console.log(err);
    }
});


// all blogs route

router.get("/blog", async (req, res) => {
    try{
        const allBlogs = await Blog.find({});
        if(allBlogs){
            res.send(allBlogs);
        }else{
            return res.status(422).json({ error: "No blogs" });
        }
    } catch (err) {
        console.log(err);
    }
    
});


// specific blog route

router.get("/blog/:blogId", async (req, res) =>{
    const blogId = req.params.blogId;
    
    if (!blogId) {
        return res.status(422).json({ error: "id not given" });
    }
    try{
        const blog = await Blog.findOne({_id: blogId});
        if(blog){
            res.send(blog);
        }else{
            return res.status(422).json({ error: "No blog found with this id" });
        }
    } catch (err) {
        console.log(err);
    }
});


//delete a blog

router.post("/blogDelete", async (req, res) =>{
    const { blogId, userId } = req.body;

    if (!blogId || !userId) {
        return res.status(422).json({ error: "id not given" });
    }
    try{
        const user = await User.findOne({_id: userId});
        if(user){
            let i;
            for(i=0; i<user.blogs.length; i++) {
                if(user.blogs[i]._id == blogId){
                    break;
                }
            };
            if(i == user.blogs.length)
                return res.status(422).json({ error: "Deletion unsuccessful" });
            user.blogs.splice(i, 1);
            const done = await user.save();
            if(done){
                const blog = await Blog.deleteOne({_id: blogId});
                if(blog){
                    res.send("Successfully deleted the corresponding blog.");
                }else{
                    return res.status(422).json({ error: "Deletion unsuccessful" });
                }
            }else{
                return res.status(422).json({ error: "Deletion unsuccessful" });
            }
        }else{
            return res.status(422).json({ error: "Deletion unsuccessful" });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;

