module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'oauth_access_tokens',
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
            accessToken: {
                field: 'access_token',
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true
            },
            expiresIn: {
                field: 'expires_in',
                type: DataTypes.INTEGER(8).UNSIGNED,
                allowNull: false
            },
            expiresOn: {
                field: 'expires_on',
                type: DataTypes.DATE,
                allowNull: false
            },
            metadata: {
                type: DataTypes.TEXT,
                allowNull: true
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
            tableName: 'oauth_access_tokens'
        }
    );
};
