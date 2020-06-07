module.exports = function(sequelize, DataTypes) {
  const suppliers = sequelize.define(
    'suppliers',
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
      address_id: {
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
    },
    {
      tableName: 'suppliers',
      paranoid: true,
      timestamps: true
    }
  );
  suppliers.associate = function(models) {
    suppliers.hasOne(models.store_products, {
      foreignKey: 'storeId',
      sourceKey: 'id'
    });
  };
  return suppliers;
};
