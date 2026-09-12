'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add totalQuantity to tools if not exists
    const tableInfo = await queryInterface.describeTable('tools');
    if (!tableInfo.totalQuantity) {
      await queryInterface.addColumn('tools', 'totalQuantity', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      });
    }

    // Create rentals table if not exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('rentals')) {
      await queryInterface.createTable('rentals', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        toolId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'tools', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        totalCost: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('pending', 'confirmed', 'active', 'returned', 'cancelled'),
          allowNull: false,
          defaultValue: 'pending',
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      await queryInterface.addIndex('rentals', ['toolId']);
      await queryInterface.addIndex('rentals', ['userId']);
      await queryInterface.addIndex('rentals', ['status']);
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rentals');
    await queryInterface.removeColumn('tools', 'totalQuantity');
  },
};
