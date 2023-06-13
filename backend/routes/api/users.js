const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
const sequelize = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ email, username, hashedPassword, firstName, lastName });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);

router.get('/:userId/spots', requireAuth, async (req, res) => {
    let userId = req.params.userId;
    let user = req.user;
    let results = {};
    const spots = await Spot.findAll({
        where: {
            ownerId: userId
        },
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
    if (parseInt(user.id) === parseInt(userId)) {
        return res.status(200).json(results)
    } else return res.status(403).json({ message: "Forbidden!" });
});

module.exports = router;
