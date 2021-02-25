'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Players', [
      {
        name: 'Maxime',
        email: 'maxime.larrieu@ynov.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Manon',
        email: 'manon.fargues@ynov.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Elon',
        email: 'elon.musk@spacex.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
      return queryInterface.bulkDelete('Players', null, {});
  }
};
