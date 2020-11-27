export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address1: {
      field: 'address_1',
      type: DataTypes.TEXT,
      allowNull: false
    },
    address2: {
      field: 'address_2',
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    long: {
      type: DataTypes.DOUBLE,
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
  const addresses = sequelize.define('addresses', getAttributes(sequelize, DataTypes), {
    tableName: 'addresses',
    paranoid: true,
    timestamps: true
  });
  addresses.associate = function(models) {
    addresses.hasMany(models.suppliers, {
      sourceKey: 'id'
    });

    addresses.hasMany(models.stores, {
      sourceKey: 'id'
    });
  };

  return addresses;
}
