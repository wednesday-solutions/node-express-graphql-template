CREATE TABLE subjects 
(
     id serial NOT NULL PRIMARY KEY,
     name text NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE,
     deleted_at TIMESTAMP WITH TIME ZONE
);