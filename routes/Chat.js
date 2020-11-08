const express = require('express');
const router = express.Router();
const { Router } = require('express');



// chat page 
router.get('/chat', function(req, res) {
    res.render('chat.ejs', { title: 'Express' });
  });
