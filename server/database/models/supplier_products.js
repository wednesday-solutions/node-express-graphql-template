module.exports = function(sequelize, DataTypes) {
  const supplierProducts = sequelize.define(
    'supplier_products',
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
      supplierId: {
        field: 'supplier_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
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
      tableName: 'supplier_products',
      paranoid: true,
      timestamps: true
    }
  );

  supplierProducts.associate = function(models) {
    supplierProducts.hasOne(models.suppliers, {
      foreignKey: 'id',
      sourceKey: 'supplierId'
    });
    supplierProducts.hasOne(models.products, {
      foreignKey: 'id',
      sourceKey: 'productId'
    });
  };
  return supplierProducts;
};
