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
    category: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
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
  const products = sequelize.define('products', getAttributes(sequelize, DataTypes), {
    tableName: 'products',
    paranoid: true,
    timestamps: true
  });

  products.associate = function(models) {
    products.supplierProducts = products.hasOne(models.supplierProducts, {
      foreignKey: 'productId',
      sourceKey: 'id'
    });
    products.purchasedProducts = products.hasOne(models.purchasedProducts, {
      foreignKey: 'productId',
      sourceKey: 'id'
    });
    products.storeProducts = products.hasOne(models.storeProducts, {
      foreignKey: 'product_id',
      sourceKey: 'id'
    });

    products.suppliers = products.belongsToMany(models.suppliers, {
      through: models.supplierProducts,
      otherKey: 'supplier_id',
      sourceKey: 'id'
    });

    products.stores = products.belongsToMany(models.stores, {
      through: models.storeProducts,
      otherKey: 'store_id',
      sourceKey: 'id'
    });
  };
  return products;
}
