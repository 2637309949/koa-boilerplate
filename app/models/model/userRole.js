'use strict'

const {
    define,
    modelName,
    attributes,
    options,
    sync
} = require('../../comm/sequelize').define
const { DataTypes } = require('sequelize')

module.exports = define(
    attributes({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID',
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '角色ID',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: '创建时间',
        }
    }),
    sync(false),
    modelName('UserRole'),
    options({
        tableName: 't_user_role',
        timestamps: true
    })
)
