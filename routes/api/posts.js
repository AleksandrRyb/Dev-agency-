const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

//load models
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Load Validation
const validatePostInput = require('../../validation/post');

//@route GET api/posts/
//@desc  Get all posts
//@acess Public
router.get('/', (req, res) => {
    Post.find()
      .sort({ date: -1 })
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json({ noposts: "Posts not found"}))
})

//@route GET api/posts/:id
//@desc  Get single post by id
//@acess Public
router.get('/:id', (req, res) => {
  Post.findById({ _id: req.params.id })
  .then(post => res.json(post))
  .catch(err => res.status(404).json({ nopost: 'Woops something went wrong' }))
})


//@route POST api/posts/
//@desc  Create new post
//@acess Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  //Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    user: req.user.id,
    avatar: req.body.avatar,
    name: req.body.name
  })
  newPost.save().then(post => res.json(post))
})

//@route DELETE api/posts/:id
//@desc  Delete post
//@acess Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id})
   .then(profile => {
     Post.findById(req.params.id)
      .then(post => {
        if(post.user.toString() !== req.user.id){
          return res.status(401).json({ nouser: "Not authorized user"})
        }
        post.remove().then(() => res.json({ msg: "Success"}))
      })
      .catch(err => res.json(err))
   })
})

//@route post api/posts/like/:id
//@desc  Delete post
//@acess Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id})
   .then(profile => {
     Post.findById(req.params.id)
      .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(400).json({ like: "You have liked this message alredy"})
      }
      //Push user id into like
      post.likes.unshift({ user: req.user.id })

      post.save().then(post => res.json({ like: true }))
      })
   })
   .catch(err => res.json(err))
})

//@route POST api/posts/unlike/:id
//@desc  Delete post
//@acess Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id})
   .then(profile => {
     Post.findById(req.params.id)
      .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id) === 0){
        return res.status(400).json({ like: "You didn't like this post yet"})
      }
      const removeLike = post.likes
        .map(item => item.user.toString())
        .indexOf(req.user.id)

      post.likes.splice(removeLike, 1)
      post.save().then(post => res.json({ unlike: true }))
      })
   })
   .catch(err => res.json(err))
})

//@route POST api/posts/comment
//@desc  Create new post
//@acess Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  //Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
        const newComment = {
          text: req.body.text,
          user: req.user.id,
          avatar: req.body.avatar,
          name: req.body.name
        }

        post.comments.unshift(newComment)
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json(err))
})

//@route DELETE api/posts/:comment/:comment_id
//@desc  Create new post
//@acess Private
router.delete('/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Post.findById(req.params.id)
    .then(post => {
      if(post.comments.filter(comment => comment.user === req.user.id) === 0){
        return res.status(401).json({ nouser: "no authorized user"})
      }
      //Create comment to delete
      const deleteComment = post.comments
       .map(item => item.user.toString())
       .indexOf(req.params.comment_id)
     //Splice comment
     post.comments.splice(deleteComment, 1)
     post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json(err))
})

module.exports = router;
