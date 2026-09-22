'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_responses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'reviews', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      adminUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'admin_users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      body: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('company_responses');
  },
};
