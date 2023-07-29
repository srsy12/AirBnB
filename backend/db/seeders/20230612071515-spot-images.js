'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://images.jacobinmag.com/wp-content/uploads/2021/05/02160332/ccsfmissioncampus.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.wienerschnitzel.com/wp-content/uploads/2014/10/Wienerschnitzel-Store-Picture-3.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.britannica.com/64/152364-050-B53A8C81/Spaceship-Earth-Epcot-Walt-Disney-World-Resort.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://www.ucsf.edu/sites/default/files/styles/full_bleed_half__image/public/2021-01/Parnassus-aerial-with-downtown-SF.jpg',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
