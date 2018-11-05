const express = require('express');
const router = express.Router();
const passport = require('passport');


//load User
const User = require('../../models/User');

//Load Profile
const Profile = require('../../models/Profile');

//Load Validation
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
const validateProfileInpit = require('../../validation/profile');

//@route GET api/profile/handle/:handle
//@desc  get profile by handle
//@acess Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = "Handle is not found";
      return res.status(404).json(errors);
    } else {
      res.json(profile);
    }
  })
  .catch(err => res.status(404).json(err))
})

//@route GET api/profile/user/user_id
//@desc  get profile by user_id
//@acess Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile= "User is not found";
      return res.status(404).json(errors);
    } else {
      res.json(profile);
    }
  })
  .catch(err => res.status(404).json({ profile: 'There is no profile for this user.' }))
})


//@route GET api/profile/all
//@desc  get all profiles
//@acess Public
router.get('/all', (req, res) => {
  errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles){
        errors.noprofile = "There are no profiles."
        return res.status(404).json(errors)
      } else {
        res.json(profiles)
      }
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles.'}));
})

//@route GET api/profile
//@desc  git user's profile
//@acess Private
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id})
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = "Profile is not found";
      return res.status(404).json(errors)
    } else {
      return res.json(profile);
    }
  })
  .catch(err => {
    errors.noprofile = err;
    return res.status(404).res.json(errors)
  })
})

//@route POST api/profile
//@desc  Load profile data
//@acess Private

router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validateProfileInpit(req.body);

    //Check validation
    if(!isValid){
      //return errors if not valid
      return res.status(400).json(errors)
    }
    //Get fielddata
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if(req.body.bio) profileFields.bio = req.body.bio;

    //Skills split into array
    if(typeof req.body.skills !== 'undefined'){
      profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user : req.user.id })
      .then(profile => {
        if(profile){
          Profile.findOneAndUpdate({ user: req.user.id }, {$set: profileFields}, { new: true })
            .then(profile => res.json(profile));
        } else {
          //Create new profile

          //Check if handle exists
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if(profile){
            errors.handle = "This handle already exists";
            res.status(400).json(errors)
            }
            //Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          })
        }
      })
})

//@route POST api/profile/experience
//@desc  Get expirience field
//@acess Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { isValid, errors } = validateExperienceInput(req.body);

  //Check validation
  if(!isValid){
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to exp array
      profile.experience.unshift(newExp)

      profile.save().then(profile => res.json(profile))
    })
})

//@route POST api/profile/education
//@desc  Get education field
//@acess Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { isValid, errors } = validateEducationInput(req.body);

  //Check validation
  if(!isValid){
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to edu array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile))
    })
})

//@route DELETE  api/profile/experience
//@desc  Delete expirience object
//@acess Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      //Splice out of array
      profile.experience.splice(removeIndex, 1);
      //Save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err))
})

//@route DELETE  api/profile/education/:edu_id
//@desc  Delete education object
//@acess Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      //Splice out of array
      profile.education.splice(removeIndex, 1);
      //Save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err))
})

//@route DELETE  api/profile/
//@desc  Delete education object
//@acess Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndDelete({ user: req.user.id })
    .then(() => {
      User.findOneAndDelete({ _id: req.user.id })
      .then(() => res.json({ msg: 'Success'}))
    })

})





module.exports = router;
