# Node.js Hapi Template

![Nodejs Hapi Template](https://github.com/wednesday-solutions/node-js-hapi-template/workflows/Nodejs%20Hapi%20Template/badge.svg)

## Out of the box support for

- Authorization middleware
- Redis Cache
- Rate Limited endpoints
- Paginated endpoints
- Swagger UI
- Support for directory based routing
- Simplified support for migrations and seeders using sequelize
- DAO layer for all database interactions
- Tests using jest

## Setup and Configuration. 

### Pre-requisites

* node

### Installation

* Install dependencies using npm

    - ```npm install```


### Setup
 
- Run ``` ./setup-local.sh ```
- This will seed the data in mysql and run the pm2 server. 


### Auto Generate models from database

- Automatically generate bare sequelize models from your database.
`https://github.com/sequelize/sequelize-auto`

Example:
`sequelize-auto -o "./models" -d temp_dev -h localhost -u root -p 3306 -x password -e mysql`


### Sequelize 
[Sequelize](https://sequelize.readthedocs.io/en/latest/) is a promise-based ORM for Node.js. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.

Install Sequelize:

- `npm install -g sequelize-cli`

Full documentation: https://sequelize.readthedocs.io/en/latest/


### MySQL Setup

Install MySQL

- `brew install mysql`

- This helps in accessing the database(`temp_dev`)

`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`;

To Access mysql
- `mysql -uroot -p` 
- This will ask for password and the altered password is `password`

- Start Server
`mysql.server start`

- Stop Server
`mysql.server stop`


### Migrations
With migrations you can transfer your existing database into another state and vice-versa.

**Setting up Sequelize Migrations for a initial database**

Steps

1. Create a `resources` folder
2. Create individual `.sql` files for each table and add it sequentially, by prefixing by 01,02 & so on.
3. Each file should contain the proper sql syntax. 
4. Point the migration files to `/resources/v1`
5. Run `npx sequlize db:migrate`

**Structure with example**

```
    /
        migrations/
            20191014145811-initial-migration.js
        resources/
            v1/
                01_create_school.sql
                02_create_student.sql
```
    
**Database State Changes**

1. Create a migration file that prefixes with the timestamp add it in the `/migrations` folder. Ex: `20191014145811-alter-student.js`
2. Add the .sql file in the `/resources/v2` 
3. Point the new migration file to `/resources/v2`
4. Run `npx sequlize db:migarte --name migartions/20191014145811-alter-student.js`

**Structure**
 
```
    /
        migrations/
            20191015143811-initial-migration.js
            20191014145811-alter-student.js
        resources/
            v1/
                01_create_school.sql
                02_create_student.sql
            v2/
                03_alter_student.sql    

```

### PM2 
[PM2](https://pm2.keymetrics.io/) is a daemon process manager that will help you manage and keep your application online 24/7
