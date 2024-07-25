const express = require('express');
const router = express.Router();


const { User, Review } = require('../models/user.js');


///users/:userId/movies
router.get('/', async(req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        res.render('movies/index.ejs',{ user: currentUser });
        } catch (error) {
            console.log(error)
            res.redirect('/')
          }
});

//display movie detail
router.get('/:id', async (req, res) => {
        try {
            const currentUser = await User.findById(req.session.user._id);
            const reviews = await Review.find().populate('userId').sort({ createdAt: -1 });
                //console.log(reviews)
            res.render('movies/show', { movieId: req.params.id, user: currentUser, reviews });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    });

router.post('/:id/add', async (req, res) => {
    try {
      const newReview = new Review({
        movieId: req.params.id,
        userId: req.session.user._id,
        content: req.body.content,
      });
      const currentUser = await User.findById(req.session.user._id);
      await newReview.save();
      res.redirect(`/users/${currentUser._id}/movies/${req.params.id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });


module.exports = router;