'use strict';

// BUG-01: The RentalQuote model (and /api/quote, /api/rentals, /api/customer/quotes)
// read/write `userId`, but the original rental_quotes migration never created that
// column, so every quote INSERT failed with "Unknown column 'userId'" -> HTTP 500.
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('rental_quotes');
    if (!tableInfo.userId) {
      await queryInterface.addColumn('rental_quotes', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      await queryInterface.addIndex('rental_quotes', ['userId']);
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('rental_quotes');
    if (tableInfo.userId) {
      await queryInterface.removeColumn('rental_quotes', 'userId');
    }
  },
};
