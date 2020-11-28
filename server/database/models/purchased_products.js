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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deliveryDate: {
      field: 'delivery_date',
      type: DataTypes.DATE,
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
  const purchasedProducts = sequelize.define('purchased_products', getAttributes(sequelize, DataTypes), {
    tableName: 'purchased_products',
    paranoid: true,
    timestamps: true
  });

  purchasedProducts.associate = function(models) {
    purchasedProducts.hasOne(models.products, {
      foreignKey: 'id',
      sourceKey: 'productId'
    });
    purchasedProducts.hasOne(models.storeProducts, {
      foreignKey: 'product_id',
      sourceKey: 'productId'
    });
    purchasedProducts.hasOne(models.supplierProducts, {
      foreignKey: 'productId',
      sourceKey: 'productId'
    });
  };
  return purchasedProducts;
}
