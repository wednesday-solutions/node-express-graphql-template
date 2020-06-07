module.exports = function(sequelize, DataTypes) {
  const stores = sequelize.define(
    'stores',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      addressId: {
        field: 'address_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id'
        }
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn('now')
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'stores',
      paranoid: true,
      timestamps: true
    }
  );

  stores.associate = function(models) {
    stores.hasOne(models.store_products, {
      foreignKey: 'storeId',
      sourceKey: 'id'
    });
  };
  return stores;
};
