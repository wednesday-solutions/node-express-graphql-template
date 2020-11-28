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
  const suppliers = sequelize.define('suppliers', getAttributes(sequelize, DataTypes), {
    tableName: 'suppliers',
    paranoid: true,
    timestamps: true
  });
  suppliers.associate = function(models) {
    suppliers.supplierProducts = suppliers.hasOne(models.supplierProducts, {
      foreignKey: 'supplier_id',
      sourceKey: 'id'
    });
    suppliers.products = suppliers.belongsToMany(models.products, {
      through: models.supplierProducts,
      otherKey: 'supplier_id',
      sourceKey: 'id'
    });

    suppliers.belongsTo(models.addresses, {
      targetKey: 'id',
      sourceKey: 'address_id'
    });
  };
  return suppliers;
}
