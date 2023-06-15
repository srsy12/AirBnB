const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const booking = require('../../db/models/booking');

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    let user = req.user;
    let results = {};

    let bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"]
            },
        ]
    });
    for (const booking of bookings) {
        const spot = booking.Spot;
        const previewImage = await SpotImage.findOne({
            attributes: ["url"],
            where: { spotId: spot.id, preview: true },
        });
        if (previewImage) {
            spot.dataValues.previewImage = previewImage.url;
        }
    }
    results.bookings = bookings;
    res.status(200).json(results);
});

router.put('/:bookingId', requireAuth, async (req, res) => {
    let userId = req.user.id;
    let bookingId = req.params.bookingId

    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }
    if (userId !== booking.userId) {
        return res.status(403).json({ message: "Forbidden!" })
    }

    let startDatey = new Date(startDate);
    let endDatey = new Date(endDate);

    if ((endDatey <= startDatey)) {
        return res.status(400).json({ message: "Bad Request", errors: { endDate: "endDate cannot be on or before startDate" } })
    };

    let oldStartDatey = new Date(booking.startDate);
    let oldEndDatey = new Date(booking.endDate)


    let currentDate = new Date();
    if (currentDate > oldEndDatey) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
    }
    //If startDate and endDate conflict with existing bookings
    if ((startDatey <= oldEndDatey) && (startDatey >= oldStartDatey) && (endDatey <= oldEndDatey) && (endDatey >= oldStartDatey)) {
        return res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates", errors: { startDate: "Start Date conflicts with an existing booking", endDate: "End Date conflicts with an existing booking" } })
    }
    //If startDate conflicts with existing booking
    else if ((startDatey <= oldEndDatey) && (startDatey >= oldStartDatey)) {
        return res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates", errors: { startDate: "Start Date conflicts with an existing booking" } })
    } //If endDate conflicts with existing booking
    else if ((endDatey <= oldEndDatey) && (endDatey >= oldStartDatey)) {
        return res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates", errors: { endDate: "End Date conflicts with an existing booking" } })
    }
    //If booking is between new start and end date
    else if ((startDatey < oldStartDatey) && (endDatey > oldEndDatey)) {
        return res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates", errors: { startDate: "Start Date conflicts with an existing booking", endDate: "End Date conflicts with an existing booking" } })
    };

    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save()

    res.status(200).json(booking);
});

//Delete an existing Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    let userId = req.user.id;
    let bookingId = req.params.bookingId;

    const currentBooking = await Booking.findByPk(bookingId);
    const spot = await Spot.findByPk(parseInt(currentBooking.spotId));


    let today = new Date();
    let startDate = new Date(currentBooking.startDate);

    if (!currentBooking) {
        return res.status(404).json({ message: "Booking couldn't be found!" })
    };
    if (spot.ownerId === userId) {
        await currentBooking.destroy();
        return res.status(200).json({ message: "Successfully Deleted!" });
    } else if (userId !== currentBooking.userId) {
        return res.status(403).json({ message: "Forbidden!" })
    };
    if (today > startDate) {
        return res.status(403).json({ message: "Bookings that have been started can't be delted" })
    };

    await currentBooking.destroy();
    return res.status(200).json({ message: "Successfully Deleted!" });
})

module.exports = router;
