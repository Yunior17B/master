const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override')
const app = express('express')
const bodyParser = require('body-parser');
const path = require('path')
const jwt = require('jsonwebtoken');
const {ROLE,users, User} = require('./models/UserModel')
const {routes, projectRouter} = require('./routes/Route.js');
const { authUser, authRole } = require('./basicAuth')


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
    
//    app.use('/', routes); app.listen(5000), () => {
//      console.log('Server is listening on Port:', app.listen(5000))
//    }
//    app.use(async (req, res, next) => {
//     if (req.headers["x-access-token"]) {
//      const accessToken = req.headers["x-access-token"];
//      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
//       // Check if token has expired
//      if (exp < Date.now().valueOf() / 1000) {
//       return res.status(401).json({
//        error: "JWT token has expired, please login to obtain a new one"
//       });
//      }
//      res.locals.loggedInUser = await User.findById(userId);
//      next();
//     } else {
//      next();
//     }
//   });

app.get('/', (req, res) => {
    res.send('Home Page')
  })
  app.use(express.json())
  app.use(setUser)
  app.get('/dashboard', authUser, (req, res) => {
    res.send('Dashboard Page')
  })
  app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
    res.send('Admin Page')
  })
  
  function setUser(req, res, next) {
    const userId = req.body.userId
    if (userId) {
      req.user = users.find(user => user.id === userId)
    }
    next()
  }
  
  app.listen(3000)
 