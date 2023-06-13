const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const { User, Spot, Review, SpotImage } = require('../../db/models');

router.get('/', async (req, res) => {
    let results = {};
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: []
            }
        ],
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ],
        group: ['Spot.Id']
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


router.post('/', requireAuth, async (req, res) => {
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
        group: ["SpotImages.id"],
    });

    if (spot) {
        return res.status(200).json(spot);
    } else {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
});

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

router.put('/:spotId', requireAuth, async (req, res) => {
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
        } else return res.status(403).json("Forbidden")
    } else return res.status(404).json("Spot couldn't be found")
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const user = req.user;
    const spotId = req.params.spotId;

    const currentSpot = await Spot.findByPk(spotId)

    if (currentSpot) {
        if (user.id === currentSpot.ownerId) {
            await currentSpot.destroy()
            return res.status(200).json('Successfully deleted')
        } else return res.status(403).json("Forbidden")
    } else return res.status(404).json("Spot couldn't be found")
})

module.exports = router;
