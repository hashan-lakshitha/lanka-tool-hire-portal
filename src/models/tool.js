module.exports = (sequelize, DataTypes) => {
  const Tool = sequelize.define('Tool', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dailyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    weeklyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  }, {
    tableName: 'tools',
    timestamps: true,
    indexes: [
      { fields: ['categoryId'] },
    ],
  });

  Tool.associate = (models) => {
    Tool.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Tool.hasMany(models.Review, {
      foreignKey: 'toolId',
      as: 'reviews',
    });
    Tool.hasMany(models.RentalQuote, {
      foreignKey: 'toolId',
      as: 'quotes',
    });
  };

  return Tool;
};