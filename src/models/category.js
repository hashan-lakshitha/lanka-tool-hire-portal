module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Category, {
      as: 'children',
      foreignKey: 'parentCategoryId',
    });
    Category.belongsTo(models.Category, {
      as: 'parent',
      foreignKey: 'parentCategoryId',
    });
    Category.hasMany(models.Tool, {
      foreignKey: 'categoryId',
      as: 'tools',
    });
  };

  return Category;
};