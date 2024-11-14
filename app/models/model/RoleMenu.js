'use strict'

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
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '角色ID',
        },
        menuId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '菜单ID',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: '创建时间',
        }
    }),
    sync(false),
    modelName('RoleMenu'),
    options({
        tableName: 't_role_menu',
        timestamps: true
    })
)
