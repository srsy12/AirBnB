'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Sad',
        lastName: 'Boy',
        email: 'sadness@gmail.com',
        username: 'codingcry',
        hashedPassword: bcrypt.hashSync('passwordy1')
      },
      {
        firstName: 'Pain',
        lastName: 'Hurt',
        email: 'pain@gmail.com',
        username: 'nopainnogain',
        hashedPassword: bcrypt.hashSync('passwordy2')
      },
      {
        firstName: 'Lil',
        lastName: 'Crying',
        email: 'lilc@gmail.com',
        username: 'lilcpain',
        hashedPassword: bcrypt.hashSync('passwordy3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['codingcry', 'nopainnogain', 'lilcpain'] }
    }, {});
  }
};
