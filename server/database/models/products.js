module.exports = function(sequelize, DataTypes) {
  const products = sequelize.define(
    'products',
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
    },
    {
      tableName: 'products',
      paranoid: true,
      timestamps: true
    }
  );

  products.associate = function(models) {
    products.hasOne(models.supplier_products, {
      foreignKey: 'productId',
      sourceKey: 'id'
    });
    products.hasOne(models.purchased_products, {
      foreignKey: 'productId',
      sourceKey: 'id'
    });
    products.hasOne(models.store_products, {
      foreignKey: 'productId',
      sourceKey: 'id'
    });
  };
  return products;
};
