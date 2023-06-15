const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    let user = req.user;
    let results = {};

    let reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });
    for (const review of reviews) {
        const spot = review.Spot;
        const previewImage = await SpotImage.findOne({
            attributes: ["url"],
            where: { spotId: spot.id, preview: true },
        });
        if (previewImage) {
            spot.dataValues.previewImage = previewImage.url;
        }
    }
    results.reviews = reviews;
    res.status(200).json(results);
});

//Add an Image to a Review based on the Review's Id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { url } = req.body;
    const reviewId = req.params.reviewId
    const user = req.user
    const review = await Review.findByPk(reviewId)
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })
    console.log(reviewImages)
    if (review) {
        if (user.id === review.userId) {
            if (reviewImages.length < 10) {
                const createdReviewImage = await ReviewImage.create({
                    reviewId: parseInt(reviewId),
                    url: url
                })
                const response = {
                    id: createdReviewImage.id,
                    url: createdReviewImage.url
                }
                return res.json(response)
            } else return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
        } else return res.status(403).json({ message: "Forbidden" })
    } else return res.status(404).json({ message: "Review couldn't be found" })
});

//Edit a Review
router.put('/:reviewsId', requireAuth, validateReview, async (req, res) => {
    let user = req.user;
    let reviewId = req.params.reviewsId;

    const { review, stars } = req.body;

    const updatedReview = await Review.findByPk(reviewId);

    if (updatedReview) {
        if (user.id === updatedReview.userId) {
            updatedReview.review = review;
            updatedReview.stars = stars;

            await updatedReview.save();
            return res.status(200).json(updatedReview);
        } else return res.status(403).json({ message: "Forbidden" })
    } else return res.status(404).json({ message: "Review couldn't be found" })

});

//Delete a Review
router.delete('/:reviewsId', requireAuth, async (req, res) => {
    const user = req.user;
    const reviewId = req.params.reviewsId;

    const currentReview = await Review.findByPk(reviewId);

    if (currentReview) {
        if (user.id === currentReview.userId) {
            await currentReview.destroy();
            return res.status(200).json({ message: "Successfully deleted" })
        } else return res.status(403).json({ message: "Forbidden" })
    } else return res.status(404).json({ message: "Review couldn't be found" })
});

//Delete a Review Image
router.delete('/:reviewId/images/:imageId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const imageId = req.params.imageId

    const review = await Review.findByPk(reviewId);
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
        return res.status(404).json({ message: "Review Image couldn't be found" })
    }

    if (review.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" })
    };

    await reviewImage.destroy()
    return res.status(200).json({ message: "Successfully deleted" })
});


module.exports = router;
