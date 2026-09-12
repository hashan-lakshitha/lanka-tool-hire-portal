'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rental_quotes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      toolId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tools', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      startDatetime: { type: Sequelize.DATE, allowNull: false },
      endDatetime: { type: Sequelize.DATE, allowNull: false },
      calculatedCost: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('rental_quotes', ['toolId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rental_quotes');
  },
};
