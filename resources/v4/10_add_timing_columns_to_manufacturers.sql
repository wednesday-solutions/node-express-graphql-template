ALTER TABLE 
  manufacturers 
add 
  COLUMN created_at timestamp WITH time zone DEFAULT NOW (), 
add 
  COLUMN updated_at timestamp WITH time zone, 
add 
  COLUMN deleted_at timestamp WITH time zone;
