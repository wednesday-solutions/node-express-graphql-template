export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      field: 'student_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    subjectId: {
      field: 'subject_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
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
  const studentSubjects = sequelize.define('student_subjects', getAttributes(sequelize, DataTypes), {
    tableName: 'student_subjects',
    paranoid: true,
    timestamps: true
  });
  studentSubjects.associate = function(models) {
    studentSubjects.students = studentSubjects.hasMany(models.students, {
      foreignKey: 'id',
      sourceKey: 'studentId'
    });
    studentSubjects.subjects = studentSubjects.hasMany(models.subjects, {
      foreignKey: 'id',
      sourceKey: 'subjectId'
    });
  };
  return studentSubjects;
}
