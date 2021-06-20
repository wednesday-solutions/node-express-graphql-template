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
    originCountry: {
      field: 'origin_country',
      type: DataTypes.TEXT,
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
  const manufacturers = sequelize.define('manufacturers', getAttributes(sequelize, DataTypes), {
    tableName: 'manufacturers',
    paranoid: true,
    timestamps: true
  });

  manufacturers.associate = function(models) {
    manufacturers.products = manufacturers.hasOne(models.products, {
      foreignKey: 'id',
      sourceKey: 'id'
    });
    manufacturers.products = manufacturers.hasMany(models.products, {
      sourceKey: 'id'
    });
  };
  return manufacturers;
}
