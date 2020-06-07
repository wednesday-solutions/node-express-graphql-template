module.exports = function(sequelize, DataTypes) {
  const addresses = sequelize.define(
    'addresses',
    {
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
    },
    {
      tableName: 'addresses',
      paranoid: true,
      timestamps: true
    }
  );
  return addresses;
};
