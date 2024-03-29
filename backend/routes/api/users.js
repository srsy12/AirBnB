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
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Username is required'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        const usernameExists = await User.findOne({
            where: {
                username: username
            }
        });

        const emailExists = await User.findOne({
            where: {
                email: email
            }
        });

        if (usernameExists && emailExists) {
            return res.status(500).json({ message: "User already exists", errors: { email: "User with that email already exists", username: "User with that username already exists" } })
        }

        if (usernameExists) {
            return res.status(500).json({ message: "User already exists", errors: { username: "User with that username already exists" } })
        }

        if (emailExists) {
            return res.status(500).json({ message: "User already exists", errors: { email: "User with that email already exists" } })
        }
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


module.exports = router;
