
const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override');
const Username = require('./models/UserModel').User;
const socket = require("socket.io");
const app = express()
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const port = process.env.PORT || 3000
const chat = require('./routes/Chat.js');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/inz',{
     useUnifiedTopology: true, 
     useNewUrlParser: true, 
     useCreateIndex: true })
     .then(()=> console.log('MongoDb Connected'))
     .catch(err => console.log(err))

app.use(expressLayouts);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({
    extended: false
}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
  secret: 'sercret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
///Articles
app.get('/', async(req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render("articles/index", { articles: articles })
});

app.get('/client', async(req, res) => {
  const articles = await Article.find().sort({
      createdAt: 'desc'
  })
  res.render("articles/client", { articles: articles })
});

app.use('/articles', articleRouter)
/**
 * Create simple login in service next time create ROLE USERS
 */
app.use(express.json())

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/login', require('./routes/index.js'));
app.use('/users', require('./routes/Users.js'));
app.set('/chat', chat);


const server = app.listen(port, function(){
  console.log('Server is running on port: ' + port)
  console.log(`http://localhost:${port}/login`);
})

app.get('/chatClient', function(req, res) {
  res.render('chat/chatClient.ejs');
});
// const rooms = { }
// console.log(rooms)
app.get('/chat', function(req, res) {
    res.render('chat/chat.ejs');
});

////// Socket Setup

const io = socket(server);
io.on("connection", function (socket) {
  //console.log("Made socket connection");
});
io.sockets.on('connection', function (socket) {

 // console.log("Socket connected.");
    
  socket.on('message', function(msg){
    io.emit('message', msg);
  });
});

io.on('connection', (socket)=>{
  console.log("a user connected via socket!")
  socket.on('disconnect', ()=>{
      console.log("a user disconnected!")
  })
  socket.on('chat message', (msg)=>{
      console.log("Message: "+msg)
      io.emit('chat message', msg)
  })
})