CREATE TABLE languages
(
    id serial NOT NULL PRIMARY KEY,
    language text NOT NULL,
    created_at timestamp WITH time zone DEFAULT NOW(),
    updated_at timestamp WITH time zone,
    deleted_at timestamp WITH time zone,

    UNIQUE (language)
);
