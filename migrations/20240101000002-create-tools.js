'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tools', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      imageUrl: { type: Sequelize.STRING, allowNull: true },
      hourlyRate: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      dailyRate: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      weeklyRate: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('tools', ['categoryId']);
    await queryInterface.addIndex('tools', ['name', 'description'], {
      type: 'FULLTEXT',
      name: 'tools_name_description_fulltext',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tools');
  },
};
