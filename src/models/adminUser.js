module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('moderator', 'manager'),
      allowNull: false,
      defaultValue: 'moderator',
    },
  }, {
    tableName: 'admin_users',
    timestamps: true,
  });

  AdminUser.associate = (models) => {
    AdminUser.hasMany(models.CompanyResponse, {
      foreignKey: 'adminUserId',
      as: 'responses',
    });
  };

  return AdminUser;
};