'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 2,
        spotId: 1,
        review: 'Some pretty cool people named Alex and Jorge here',
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Too many foreigners',
        stars: 1
      },
      {
        userId: 3,
        spotId: 2,
        review: 'Yummy glizzys here',
        stars: 5
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
