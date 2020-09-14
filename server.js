require('dotenv').config();

const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override')
const app = express('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/inz',{
     useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
     .then(()=> console.log('MongoDb Connccted'))
     .catch(err => console.log(err))

const Users = require('./routes/Users')

app.use('/users', Users)



app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(port, function(){
  console.log('Server is running on port: ' + port)
})
  
 