const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override')
const app = express('express')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb://localhost/inz',{
     useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })


app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended: false
}))
app.use(methodOverride('_method'))



app.get('/', async(req, res) => {
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

const users = []
app.get('/users', (req, res) => {
    res.json(users)
});

 app.post('/users',async (req, res)=>{
     try{
         const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)    
   
    const user =  {name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
     } catch{
         res.status(500).send()
     }
 })

 app.post('/users/login', async (req, res) =>{
     const user = users.find(user => user.name = req.body.name)
    if(user == null){
        return res.status(400).send('Cannot find user')
        }
        try{
        if(await  bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else{
            res.send('Not Allowed')
        }
        } catch{
            res.status(500).send()
        }
 
    })
app.listen(5000)