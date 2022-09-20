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
    authorId: {
      field: 'author_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'authors',
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
  const authorsBooks = sequelize.define('authors_books', getAttributes(sequelize, DataTypes), {
    tableName: 'authors_books',
    paranoid: false,
    timestamps: true
  });

  authorsBooks.associate = function(models) {
    authorsBooks.books = authorsBooks.hasMany(models.books, {
      foreignKey: 'id',
      sourceKey: 'bookId'
    });
    authorsBooks.authors = authorsBooks.hasMany(models.authors, {
      foreignKey: 'id',
      sourceKey: 'authorId'
    });
  };

  return authorsBooks;
}
