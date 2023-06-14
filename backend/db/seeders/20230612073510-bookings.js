'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: "2023-6-19",
        endDate: "2023-6-20"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2023-7-10",
        endDate: "2023-7-11"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2023-6-20",
        endDate: "2023-6-21"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
