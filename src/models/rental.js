module.exports = (sequelize, DataTypes) => {
  const Rental = sequelize.define('Rental', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    toolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'active', 'returned', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'rentals',
    timestamps: true,
    indexes: [
      { fields: ['toolId'] },
      { fields: ['userId'] },
      { fields: ['status'] },
    ],
  });

  Rental.associate = (models) => {
    Rental.belongsTo(models.Tool, {
      foreignKey: 'toolId',
      as: 'tool',
    });
    Rental.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Rental;
};
