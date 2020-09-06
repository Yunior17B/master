require('dotenv').config();

const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override')
const app = express('express')
const bodyParser = require('body-parser');
const path = require('path')
const jwt = require('jsonwebtoken');
// const {ROLE,users, User} = require('./models/UserModel')
// const {routes, projectRouter} = require('./routes/Route.js');
// const { authUser, authRole } = require('./basicAuth')


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

app.get('/posts', authenticateToken, (req, res)=> {
  res.jason(posts.filter(post => post.username === req.user.name))
})

app.post('/', (req, res) => {
    res.send('Home Page')
    const username = req.body.username
    const user = {
      name: username
    }
   const accessToken= jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
    res.render("templates/login")
  })
  function authenticateToken(req, res, next){
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err) return res.sendSatus(403)
      req.user = user
      next()
    })
  }

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
 