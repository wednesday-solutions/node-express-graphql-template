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

CREATE INDEX student_subjects_student_id ON student_subjects USING btree 
(student_id);
CREATE INDEX student_subjects_subject_id ON student_subjects USING btree 
(subject_id);

ALTER TABLE student_subjects ADD CONSTRAINT student_subjects_unique_fkeys 
UNIQUE (student_id, subject_id);
