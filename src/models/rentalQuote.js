module.exports = (sequelize, DataTypes) => {
  const RentalQuote = sequelize.define('RentalQuote', {
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
      allowNull: true,
    },
    startDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    calculatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    tableName: 'rental_quotes',
    timestamps: true,
    indexes: [
      { fields: ['toolId'] },
      { fields: ['userId'] },
    ],
  });

  RentalQuote.associate = (models) => {
    RentalQuote.belongsTo(models.Tool, {
      foreignKey: 'toolId',
      as: 'tool',
    });
    RentalQuote.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return RentalQuote;
};