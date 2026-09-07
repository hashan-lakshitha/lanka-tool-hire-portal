const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = require('./category')(sequelize, DataTypes);
const Tool = require('./tool')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const AdminUser = require('./adminUser')(sequelize, DataTypes);

const models = {
  Category,
  Tool,
  User,
  AdminUser,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};