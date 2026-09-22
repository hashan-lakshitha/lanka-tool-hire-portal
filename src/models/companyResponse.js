module.exports = (sequelize, DataTypes) => {
  const CompanyResponse = sequelize.define('CompanyResponse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    adminUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'company_responses',
    timestamps: true,
  });

  CompanyResponse.associate = (models) => {
    CompanyResponse.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      as: 'review',
    });
    CompanyResponse.belongsTo(models.AdminUser, {
      foreignKey: 'adminUserId',
      as: 'adminUser',
    });
  };

  return CompanyResponse;
};