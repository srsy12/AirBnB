'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "456 AA Street",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 36.1234567,
        lng: -36.1234567,
        name: "App Academy",
        description: "We learn how code do good",
        price: 69
      },
      {
        ownerId: 2,
        address: "19223 Bologna Drive",
        city: "Rowland Heights",
        state: "California",
        country: "United States of America",
        lat: 41.1234567,
        lng: -41.1234567,
        name: "WeinerSchnitzel",
        description: "We learn how process meats good",
        price: 420
      },
      {
        ownerId: 3,
        address: "2198 New York Park",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 69.1234567,
        lng: -69.1234567,
        name: "EPCOT",
        description: "We know places of places good",
        price: 38
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'WeinerSchnitzel', 'EPCOT'] }
    }, {});
  }
};
