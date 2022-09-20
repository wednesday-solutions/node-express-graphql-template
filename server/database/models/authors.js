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
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  const authors = sequelize.define('authors', getAttributes(sequelize, DataTypes), {
    tableName: 'authors',
    paranoid: true,
    timeStamps: true
  });

  authors.associate = function(models) {
    // authors.books = authors.hasMany(models.books, {
    //   foreignKey: 'id',
    //   sourceKey: 'bookId'
    // });
    authors.authorsBooks = authors.hasOne(models.authorsBooks, {
      sourceKey: 'id',
      foreignKey: 'author_id'
    });
  };

  return authors;
}
