const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = require('./category')(sequelize, DataTypes);
const Tool = require('./tool')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const AdminUser = require('./adminUser')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);
const ReviewComment = require('./reviewComment')(sequelize, DataTypes);
const CompanyResponse = require('./companyResponse')(sequelize, DataTypes);
const RentalQuote = require('./rentalQuote')(sequelize, DataTypes);
const Rental = require('./rental')(sequelize, DataTypes);

const models = {
  Category,
  Tool,
  User,
  AdminUser,
  Review,
  ReviewComment,
  CompanyResponse,
  RentalQuote,
  Rental,
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