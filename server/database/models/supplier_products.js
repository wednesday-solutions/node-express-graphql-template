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
  };
}

export function model(sequelize, DataTypes) {
  const supplierProducts = sequelize.define('supplier_products', getAttributes(sequelize, DataTypes), {
    tableName: 'supplier_products',
    paranoid: true,
    timestamps: true
  });

  supplierProducts.associate = function(models) {
    supplierProducts.suppliers = supplierProducts.hasOne(models.suppliers, {
      foreignKey: 'id'
    });
    supplierProducts.products = supplierProducts.hasOne(models.products, {
      foreignKey: 'id'
    });
  };
  return supplierProducts;
}
