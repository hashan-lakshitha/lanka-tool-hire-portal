module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    performanceRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    customerServiceRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    supportRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    afterSalesRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    miscRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    moderatedByAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    moderatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      { fields: ['toolId'] },
      { fields: ['status'] },
    ],
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Tool, {
      foreignKey: 'toolId',
      as: 'tool',
    });
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Review.hasMany(models.ReviewComment, {
      foreignKey: 'reviewId',
      as: 'comments',
    });
    Review.hasOne(models.CompanyResponse, {
      foreignKey: 'reviewId',
      as: 'response',
    });
  };

  return Review;
};