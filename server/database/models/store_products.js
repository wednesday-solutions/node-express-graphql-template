export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      field: 'product_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    storeId: {
      field: 'store_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
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
  const storeProducts = sequelize.define('store_products', getAttributes(sequelize, DataTypes), {
    tableName: 'store_products',
    paranoid: true,
    timestamps: true
  });

  storeProducts.associate = function(models) {
    storeProducts.stores = storeProducts.hasOne(models.stores, {
      foreignKey: 'id'
    });
    storeProducts.products = storeProducts.hasOne(models.products, {
      foreignKey: 'id'
    });
  };
  return storeProducts;
}
