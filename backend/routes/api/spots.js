const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .isLength({ min: 4, max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

//Get All Spots
router.get('/', async (req, res) => {
    let results = {};
    const spots = await Spot.findAll({
        order: [["id"]],
        include: [
            {
                model: Review,
                attributes: []
            }
        ],
        attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",
            [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
        ],
        group: ["Spot.id"]
    });

    for (const spot of spots) {
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true },
        });
        if (previewImage) {
            spot.dataValues.previewImage = previewImage.dataValues.url;
        }
    };

    results.spots = spots;
    res.status(200);
    res.json(results);
});

//Get all Spots owned by the current User
router.get('/current', requireAuth, async (req, res) => {
    let user = req.user;
    let results = {};
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        order: [["id"]],
        include: [
            {
                model: Review,
                attributes: []
            }
        ],
        attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",
            [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
        ],
        group: ["Spot.id"]
    });

    for (const spot of spots) {
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true },
        });
        if (previewImage) {
            spot.dataValues.previewImage = previewImage.dataValues.url;
        }
    };

    results.spots = spots;

    return res.status(200).json(results)

});

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const ownerId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    let result = {
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price
    }
    return res.status(201).json(result);
});

//Get all details of a spot from an id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId,
        },
        include: [
            {
                model: Review,
                attributes: [],
            },
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"],
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"],
            },
        ],
        attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",
            [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
            [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
        ],
        group: ["SpotImages.id", "Spot.id"]
    });

    if (spot) {
        return res.status(200).json(spot);
    } else {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
});

//Add an image to a spot based on an id
router.post("/:spotId/images", requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const user = req.user;
    const spotId = req.params.spotId;

    const currentSpot = await Spot.findByPk(spotId);

    if (currentSpot) {
        if (user.id === currentSpot.ownerId) {
            const spotImage = await SpotImage.create({
                spotId: spotId,
                url: url,
                preview: preview,
            });
            let result = {
                id: spotImage.id,
                url: spotImage.url,
                preview: spotImage.preview
            };
            currentSpot.addSpotImage(spotImage);
            return res.status(200).json(result);
        } else return res.status(403).json({ message: "Forbidden!" });
    } else return res.status(404).json({ message: "Spot couldn't be found!" });
});

//edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    let spotId = req.params.spotId;
    const user = req.user;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    let updatedSpot = await Spot.findByPk(spotId);

    if (updatedSpot) {
        if (user.id === updatedSpot.ownerId) {
            updatedSpot.address = address;
            updatedSpot.city = city;
            updatedSpot.state = state;
            updatedSpot.country = country;
            updatedSpot.lat = lat;
            updatedSpot.lng = lng;
            updatedSpot.name = name;
            updatedSpot.description = description;
            updatedSpot.price = price;

            await updatedSpot.save();

            let result = {
                address: updatedSpot.address,
                city: updatedSpot.city,
                state: updatedSpot.state,
                country: updatedSpot.country,
                lat: updatedSpot.lat,
                lng: updatedSpot.lng,
                name: updatedSpot.name,
                description: updatedSpot.description,
                price: updatedSpot.price,
                createdAt: updatedSpot.createdAt,
                updatedAt: updatedSpot.updatedAt
            };

            return res.status(200).json(result);
        } else return res.status(403).json({ message: "Forbidden!" })
    } else return res.status(404).json({ message: "Spot couldn't be found!" })
});

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const user = req.user;
    const spotId = req.params.spotId;

    const currentSpot = await Spot.findByPk(spotId)

    if (currentSpot) {
        if (user.id === currentSpot.ownerId) {
            await currentSpot.destroy()
            return res.status(200).json({ message: "Successfully Deleted!" })
        } else return res.status(403).json({ message: "Forbidden!" })
    } else return res.status(404).json({ message: "Spot couldn't be found!" })
});

//Get all reviews by spotId
router.get("/:spotId/reviews", async (req, res) => {
    const spotId = req.params.spotId;

    const reviews = await Review.findAll({
        where: {
            spotId: spotId,
        },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"],
            },
        ],
    });

    if (reviews.length) return res.status(200).json(reviews);
    else return res.status(404).json({ message: "Spot couldn't be found" });
});

//Create review by spotId
router.post("/:spotId/reviews", requireAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    const userReviewCheck = await Review.findOne({
        where: {
            userId: userId,
            spotId: spotId,
        },
    });

    if (spot) {
        if (!userReviewCheck) {
            const createdReview = await Review.create({ userId, spotId, review, stars });
            return res.status(201).json(createdReview);
        } else
            return res
                .status(500)
                .json({ message: "User already has a review for this spot" });
    } else return res.status(404).json({ message: "Spot couldn't be found" });
});


module.exports = router;
