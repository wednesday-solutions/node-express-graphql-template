export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    language: {
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
  const languages = sequelize.define('languages', getAttributes(sequelize, DataTypes), {
    tableName: 'languages',
    paranoid: false,
    timeStamps: true
  });

  languages.associate = function(models) {
    // languages.hasMany(models.books, {
    //   sourceKey: 'id',
    //   foreignKey: 'language_id'
    // });

    languages.booksLanguages = languages.hasOne(models.booksLanguages, {
      sourceKey: 'id',
      foreignKey: 'language_id'
    });
  };

  return languages;
}
