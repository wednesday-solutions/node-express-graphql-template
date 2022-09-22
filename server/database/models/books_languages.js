export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bookId: {
      field: 'book_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      }
    },
    languageId: {
      field: 'language_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'languages',
        key: 'id'
      }
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
  const booksLanguages = sequelize.define('books_languages', getAttributes(sequelize, DataTypes), {
    tableName: 'books_languages',
    paranoid: false,
    timestamps: true
  });

  booksLanguages.associate = function(models) {
    booksLanguages.books = booksLanguages.hasMany(models.books, {
      foreignKey: 'id',
      sourceKey: 'bookId'
    });
    booksLanguages.languages = booksLanguages.hasMany(models.languages, {
      foreignKey: 'id',
      sourceKey: 'languageId'
    });
  };

  return booksLanguages;
}
