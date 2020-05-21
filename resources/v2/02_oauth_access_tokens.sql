create table oauth_access_tokens (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  oauth_client_id INT NULL, 
  access_token VARCHAR(64) NOT NULL, 
  expires_in MEDIUMINT UNSIGNED NOT NULL, 
  expires_on DATETIME NOT NULL, 
  metadata LONGTEXT COLLATE UTF8MB4_BIN NULL, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME NULL on UPDATE CURRENT_TIMESTAMP, 
  CONSTRAINT oauth_access_tokens_access_token_uindex UNIQUE (access_token), 
  CONSTRAINT oauth_access_tokens_oauth_clients_id_fk FOREIGN KEY (oauth_client_id) REFERENCES oauth_clients (id) ON UPDATE CASCADE, 
  CONSTRAINT metadata CHECK (
    json_valid(`metadata`)
  )
);
