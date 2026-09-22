'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      toolId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tools', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      title: { type: Sequelize.STRING, allowNull: false },
      body: { type: Sequelize.TEXT, allowNull: false },
      performanceRating: { type: Sequelize.INTEGER, allowNull: false },
      customerServiceRating: { type: Sequelize.INTEGER, allowNull: false },
      supportRating: { type: Sequelize.INTEGER, allowNull: false },
      afterSalesRating: { type: Sequelize.INTEGER, allowNull: false },
      miscRating: { type: Sequelize.INTEGER, allowNull: true },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
      moderatedByAdminId: { type: Sequelize.INTEGER, allowNull: true },
      moderatedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('reviews', ['toolId']);
    await queryInterface.addIndex('reviews', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reviews');
  },
};
