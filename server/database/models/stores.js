export function getAttributes(sequelize, DataTypes) {
  return {
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
  };
}

export function model(sequelize, DataTypes) {
  const stores = sequelize.define('stores', getAttributes(sequelize, DataTypes), {
    tableName: 'stores',
    paranoid: true,
    timestamps: true
  });

  stores.associate = function(models) {
    stores.storeProducts = stores.hasOne(models.storeProducts, {
      foreignKey: 'store_id',
      sourceKey: 'id'
    });
    stores.products = stores.belongsToMany(models.products, {
      through: models.storeProducts,
      otherKey: 'store_id',
      sourceKey: 'id'
    });

    stores.belongsTo(models.addresses, {
      targetKey: 'id',
      sourceKey: 'address_id'
    });
  };
  return stores;
}
