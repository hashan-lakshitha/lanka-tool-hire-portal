module.exports = (sequelize, DataTypes) => {
  const ReviewComment = sequelize.define('ReviewComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    tableName: 'review_comments',
    timestamps: true,
    indexes: [
      { fields: ['reviewId'] },
    ],
  });

  ReviewComment.associate = (models) => {
    ReviewComment.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      as: 'review',
    });
    ReviewComment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return ReviewComment;
};