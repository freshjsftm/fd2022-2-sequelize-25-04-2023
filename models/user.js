'use strict';
const { Model } = require('sequelize');
const { isAfter } = require('date-fns');
module.exports = (sequelize, DataTypes) => {
  class User extends Model { //User -> Users
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      firstName: {
        field: 'first_name',
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      lastName: {
        field: 'last_name',
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      password: {
        field: 'password_hash',
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      birthday: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
          isValidDate(value) {
            if (isAfter(new Date(value), new Date())) {
              throw new Error('check birthday');
            }
          },
        },
      },
      isMale: {
        field: 'is_male',
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
    }
  );
  return User;
};
