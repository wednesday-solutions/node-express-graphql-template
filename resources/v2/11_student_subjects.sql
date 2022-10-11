CREATE TABLE student_subjects 
(
     id serial NOT NULL PRIMARY KEY,
     student_id integer NOT NULL,
     subject_id integer NOT NULL,
     created_at timestamp WITH time zone DEFAULT NOW(),
     updated_at timestamp WITH time zone,
     deleted_at timestamp WITH time zone,
     CONSTRAINT student_subjects_student_id FOREIGN KEY
     (student_id) REFERENCES students (id),
     CONSTRAINT student_subjects_subject_id FOREIGN KEY
     (subject_id) REFERENCES subjects (id)
);