module.exports = function(sequelize, DataTypes) {
  const purchasedProducts = sequelize.define(
    'purchased_products',
    {
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
    },
    {
      tableName: 'purchased_products',
      paranoid: true,
      timestamps: true
    }
  );

  purchasedProducts.associate = function(models) {
    purchasedProducts.hasOne(models.products, {
      foreignKey: 'id',
      sourceKey: 'productId'
    });
    purchasedProducts.hasOne(models.store_products, {
      foreignKey: 'productId',
      sourceKey: 'productId'
    });
    purchasedProducts.hasOne(models.supplier_products, {
      foreignKey: 'productId',
      sourceKey: 'productId'
    });
  };
  return purchasedProducts;
};
