import db from '@database/models';

export const insertStudentSubjects = args => db.studentSubjects.create(args);
