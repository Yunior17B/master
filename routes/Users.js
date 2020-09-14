const express = require('express')
const Usersi = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/UserModel')


Usersi.use(cors());
process.env.SECRET_KEY= 'secret';

Usersi.post('/register', (req, res) => {
    const today = new Data();
    const userData = {
      email: req.body.email,
      password: req.body.password,
     create: today 
     }
     User.findOne({
       email: req.body.email
     })
     .then(user => {
       if(!user){
         bcrypt.hash(req.body.password, 10, (err, hash)=> {
           userData.password = hash
           User.create(userData)
           .then(user =>{
             res.json({
               status: user.email + 'Registered!'
             })
             .catch(err =>{
               res.send('error: ' + err)
             })
           })
         })
       } else {
           res.json({
               error: 'User already exists'
           })
       }
     })
     .catch(err => {
         res.send('error: ' + err)
     })
  })
Usersi.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            const payload = {
                _id:user._id,
                email: user.email
            }
            let token = jwt.sign(payload.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.send(token)
        } else{
            //Password don't match
            res.json({error: 'User does not exist'})
        }
    } else{
        res.json({ error: 'User deas not exost'})
    }
    })
    .catch(err =>{
        res.send('error: '+ err)
    })
})

Usersi.get('/profile', (req, res)=> {
    var decoded = jwt.verify(req.header['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id:decoded._id
    })
    .then(user => {
        if(user){
            res.json(user)
        } else {
            res.send('User deas not exist')
        }
    })
    .catch(err =>{
        res.send('error: ' + err)
    })
})

module.exports = Usersi
