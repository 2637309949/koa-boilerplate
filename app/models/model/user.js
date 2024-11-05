'use strict'

const { DataTypes } = require('sequelize')
const { define, modelName, attributes, options, associate } = require('../../comm/sequelize').define

module.exports = define(modelName('User'), attributes({
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
    }
}), options({
    tableName: 't_user',
    timestamps: false
}), associate(function (User, models) {
    User.hasMany(models.Article)
}))
