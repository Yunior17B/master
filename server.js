const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override')
const app = express('express')
const bodyParser = require('body-parser');
const path = require('path')
const jwt = require('jsonwebtoken');
const User = require('./models/UserModel')
const routes = require('./routes/Route.js');

mongoose.connect('mongodb://localhost/inz',{
     useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })


app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended: false
}))
app.use(methodOverride('_method'))



app.get('/Art', async(req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render("articles/index", { articles: articles })
});

app.use('/articles', articleRouter)
/**
 * Create simple login in service next time create ROLE USERS
 */
app.use(express.json())

require("dotenv").config({
    path: path.join(__dirname, ".env")
   });
    
   app.use(bodyParser.urlencoded({ extended: true }));
    
   app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     } 
     res.locals.loggedInUser = await User.findById(userId); next(); 
    } else { 
     next(); 
    } 
   });
    
   app.use('/', routes); app.listen(5000), () => {
     console.log('Server is listening on Port:', app.listen(5000))
   }
   app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
      // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
       error: "JWT token has expired, please login to obtain a new one"
      });
     }
     res.locals.loggedInUser = await User.findById(userId);
     next();
    } else {
     next();
    }
  });
 