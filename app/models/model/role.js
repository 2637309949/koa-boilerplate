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
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: '唯一标识ID',
        },
        type: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            comment: '角色类型(0：系统角色 1：自定义角色)',
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '角色名称',
        },
        code: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '角色编码',
        },
        remark: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '备注',
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            comment: '状态',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: '创建时间',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: '更新时间',
        }
    }),
    sync(false),
    modelName('Role'),
    options({
        tableName: 't_role',
        timestamps: true
    })
)
