module.exports = function(sequelize, DataTypes) {
  const storeProducts = sequelize.define(
    'store_products',
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
    },
    {
      tableName: 'store_products',
      paranoid: true,
      timestamps: true
    }
  );

  storeProducts.associate = function(models) {
    storeProducts.hasOne(models.stores, {
      foreignKey: 'id',
      sourceKey: 'storeId'
    });
    storeProducts.hasOne(models.products, {
      foreignKey: 'id',
      sourceKey: 'productId'
    });
  };
  return storeProducts;
};
