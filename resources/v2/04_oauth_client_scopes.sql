create table oauth_client_scopes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  oauth_client_id INT NULL, 
  scope ENUM(
    'INTERNAL_SERVICE', 'SUPER_ADMIN', 'ADMIN', 
    'USER'
  ), 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
  updated_at DATETIME NULL on UPDATE CURRENT_TIMESTAMP, 
  constraint oauth_client_scopes_oauth_client_id_scope_uindex UNIQUE (oauth_client_id, scope), 
  constraint oauth_client_scopes_oauth_clients_id_fk FOREIGN KEY (oauth_client_id) REFERENCES oauth_clients (id) ON UPDATE CASCADE
);

