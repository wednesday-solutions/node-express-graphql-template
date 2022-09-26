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
    country: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
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
  const publishers = sequelize.define('publishers', getAttributes(sequelize, DataTypes), {
    tableName: 'publishers',
    paranoid: false,
    timeStamps: true
  });

  publishers.associate = function(models) {
    publishers.hasMany(models.books, {
      sourceKey: 'id',
      foreignKey: 'publisher_id'
    });
  };

  return publishers;
}
