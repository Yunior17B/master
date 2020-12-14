const express = require('express')
const articleRouter = require("./routes/articles")
const mongoose = require('mongoose')
const Article = require ('./models/article')
const methodOverride = require('method-override');
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
const  User  = require('./models/UserModel').User;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/inz',{
     useUnifiedTopology: true, 
     useNewUrlParser: true, 
     useCreateIndex: true })
     .then(()=> console.log('MongoDb Connected'))
     .catch(err => console.log(err)), 
     
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

app.get('/chat', async(req, res) => {
  const users = await User.find();
    res.render('chat/chat.ejs', {users: users});
});

const Username = User.find();
app.get('/chat/User', (req, res)=>{
    if(Username[req.body.users] != null){
    return res.render('/chat')
    }
    Username[req.body.users] = { User: {}}
    res.redirect(req.body.users)
    io.emit('room-created', req.body.users)
})

app.get('/chat/:User', (req, res) => {
    if (Username[req.params.users] == null) {
      return res.redirect('/chat')
      
    }
    res.render('room', { roomName: req.params.users })
   req.flash('welcome to chat' )

  })

////// Socket Setup

const io = socket(server);
mongoose.connect('mongodb://localhost/inz', function(err, db){
    if(err){
        throw err;
    }
    console.log('MongoDB connected...');
    // Connect to Socket.io
    io.on('connection', function(socket){
        let chat = db.collection('chats');
        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }
        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }
            // Emit the messages
            socket.emit('output', res);
        });
        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;
            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function(){
                    io.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });
        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});