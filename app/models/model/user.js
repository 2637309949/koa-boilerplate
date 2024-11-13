'use strict'

const { 
    define, 
    modelName, 
    attributes, 
    options, 
    associate 
} = require('../../comm/sequelize').define
const { DataTypes } = require('sequelize')

module.exports = define(
    attributes({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true
        }
    }),
    modelName('User'),
    associate(function (User, models) {
        User.hasMany(models.Article)
    }),
    options({
        tableName: 't_user',
        timestamps: true,
        paranoid: true
    })
)
