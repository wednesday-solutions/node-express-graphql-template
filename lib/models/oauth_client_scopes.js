import { SCOPE_TYPE } from 'utils/seedData';
module.exports = function(sequelize, DataTypes) {
    const oauthClientScopes = sequelize.define(
        'oauth_client_scopes',
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
            scope: {
                type: DataTypes.ENUM(
                    SCOPE_TYPE.INTERNAL_SERVICE,
                    SCOPE_TYPE.SUPER_ADMIN,
                    SCOPE_TYPE.ADMIN,
                    SCOPE_TYPE.USER
                ),
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
            tableName: 'oauth_client_scopes'
        }
    );
    oauthClientScopes.associate = function(models) {
        oauthClientScopes.hasOne(models.oauth_clients, {
            foreignKey: 'id',
            sourceKey: 'oauthClientId'
        });
    };
    return oauthClientScopes;
};
