import { RESOURCE_TYPE } from 'utils/seedData';
module.exports = function(sequelize, DataTypes) {
    const oauthClientResources = sequelize.define(
        'oauth_client_resources',
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            oauthClientId: {
                field: 'oauth_client_id',
                type: DataTypes.INTEGER(11),
                allowNull: false,
                references: {
                    model: 'oauth_clients',
                    key: 'id'
                }
            },
            resourceType: {
                field: 'resource_type',
                type: DataTypes.ENUM(RESOURCE_TYPE.LIST_ID),
                allowNull: false
            },
            resourceId: {
                field: 'resource_id',
                type: DataTypes.INTEGER(10),
                allowNull: false
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            tableName: 'oauth_client_resources'
        }
    );
    oauthClientResources.associate = function(models) {
        oauthClientResources.hasOne(models.oauth_clients, {
            foreignKey: 'id',
            sourceKey: 'oauthClientId'
        });
    };
    return oauthClientResources;
};
