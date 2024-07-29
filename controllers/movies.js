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

router.get('/profile', async(req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    const userReviews = await Review.find({userId:currentUser._id})
    console.log(userReviews)
    res.render('movies/profile.ejs', {user:currentUser, userReviews})
  })

//display movie detail
router.get('/:id', async (req, res) => {
        try {
            const currentUser = await User.findById(req.session.user._id);
            const reviews = await Review.find({movieId: req.params.id}).populate('userId').sort({ createdAt: -1 });
            res.render('movies/show', { movieId: req.params.id, user: currentUser, reviews });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    });

//users/:userId/movies/movieId/add
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


router.delete('/profile/reviews/:reviewId', async (req,res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const { reviewId } = req.params;
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/users/${currentUser._id}/movies/profile`);
      } catch (error) {
        console.error(error);
        res.redirect(`/users/${currentUser._id}/movies/profile`);
      }
})


router.get('/profile/reviews/:reviewId/edit', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id)
      const { reviewId } = req.params
      const review = await Review.findById(reviewId)
      res.render('movies/edit.ejs', {
        user: currentUser,
        reviewId,
        reviewContent: review.content
      });
    } catch (error) {
      console.log(error);
      res.redirect(`/users/${currentUser._id}/movies/profile`)
    }
  });


router.put('/profile/reviews/:reviewId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)
        review.content = req.body.content
        await review.save()
      res.redirect(
        `/users/${currentUser._id}/movies/profile`
      );
    } catch (error) {
      console.log(error);
      res.redirect(`/users/${currentUser._id}/movies/profile`)
    }
  });




module.exports = router;