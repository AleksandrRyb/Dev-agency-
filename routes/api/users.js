const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

//User Model
const User = require('../../models/User');

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//@route GET api/users/test
//@desc  Testing route
//@acess Public
router.get('/test', (req, res) => res.json({msg: 'User Works'}));

//@route POST api/users/register
//@desc  Register User
//@acess Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email})
    .then(user => {
      if(user){
        errors.email = 'Email elready exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email,{
          s: '200', //Size
          r: 'pg', //Rating
          d: 'mm' //Default
        });
        const newUser = new User({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          avatar
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
          })
        })
      }
    })
})

//@route POST api/users/login
//@desc  Login user and  get JWT tocen
//@acess Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email}).then(user => {
    //Cheking user
    if(!user){
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }

    //Compare the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if(isMatch){
        //User matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar};

        //Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            })
          })
      } else {
        errors.password
        return res.status(400).json(errors)
      }
    })
  })
})

//@route GET api/users/current
//@desc  Current User
//@acess Private

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    avatar: req.user.avatar
  });
})

module.exports = router;
