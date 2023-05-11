<img align="left" src="https://github.com/wednesday-solutions/node-express-graphql-template/blob/develop/node_express_graphql_template_github.svg" width="480" height="620" />

<div>
  <a href="https://www.wednesday.is?utm_source=gthb&utm_medium=repo&utm_campaign=serverless" align="left" style="margin-left: 0;">
    <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f5879492fafecdb3e5b0e75_wednesday_logo.svg">
  </a>
  <p>
    <h1 align="left">Node Express GraphQL Template
    </h1>
  </p>

  <p>
An enterprise Express GraphQL template application built using nodejs showcasing - Testing Strategy, DB migrations and seeding, integration with an ORM, containerization using Docker, GraphQL Interface, support for GraphQL relay, integration with graphql-sequelize, support for aggregation queries, PostgreSQL
  </p>

---

  <p>
    <h4>
      Expert teams of digital product strategists, developers, and designers.
    </h4>
  </p>

  <div>
    <a href="https://www.wednesday.is/contact-us?utm_source=gthb&utm_medium=repo&utm_campaign=serverless" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88b9005f9ed382fb2a5_button_get_in_touch.svg" width="121" height="34">
    </a>
    <a href="https://github.com/wednesday-solutions/" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88bb1958c3253756c39_button_follow_on_github.svg" width="168" height="34">
    </a>
  </div>

---

<span>We’re always looking for people who value their work, so come and join us. <a href="https://www.wednesday.is/hiring">We are hiring!</a></span>

</div>

![Node Express GraphQL Template CI](https://github.com/wednesday-solutions/node-express-graphql-template/workflows/Node%20Express%20GraphQL%20Template%20CI/badge.svg)

<div>
<img src='./badges/badge-statements.svg' height="20"/>
<img src='./badges/badge-branches.svg' height="20"/>
</div>
<div>
<img src='./badges/badge-lines.svg'  height="20"/>
<img src='./badges/badge-functions.svg' height="20"/>
</div>

##

  <p>
    <h3 align="left">Built using <a href="https://github.com/wednesday-solutions/negt-cli/blob/develop/README.md" target="_blank">Negt CLI</a>
    </h3>
  </p>

## A relay compliant server built using

- Node
- Express
- Postgres
- GraphQL
- Docker

## Out of the box support for 
- Containerization using Docker
- Multi layered docker image support
- CI pipeline that runs on every pull request
- Simply add in the github secrets and uncomment the [cd.yml](.github/workflows/cd.yml) to deploy to ECS
- GraphQL relay compliant server
- RBAC auth middleware
- Out of the box support to run database migrations and seeders using sequelize
- Multi environment support using the dotenv library
- precommit hooks to run tests
- docker-compose to run the application without installing additional db, and cache infrastructure
- Autogenerate queries and mutations based on GQL models 
- Support for circuit breaking has been added using [opossum](https://github.com/nodeshift/opossum)
- Support for sending slack alerts on desired errors has been added using [slack-notify](https://www.npmjs.com/package/slack-notify)
- Support for caching added with [redis](https://redis.io/)
- Support for custom mutations has been added along with support for updating only specific fields
- Support for adding a job and queuing it has been added using [bull](https://github.com/OptimalBits/bull)
- GraphQl subscriptions have been added using [apollo-server](https://www.npmjs.com/package/apollo-server-express) & [graphql-redis-subscriptions](https://www.npmjs.com/package/graphql-redis-subscriptions)
- Support for caching of aggregate data added using Redis

## Dependencies

### graphql-sequelize

Please go through the [documentation](https://github.com/mickhansen/graphql-sequelize) to understand the control flow.

Relay support has been added by following [this](https://github.com/mickhansen/graphql-sequelize/blob/master/docs/relay.md) documentation

## Setup

### Setting up database (postgres)

- Requirement [postgresql](https://www.postgresql.org/)

Steps to set up database with `username` and `role` using terminal

- Enter postgres terminal `psql postgres`
- Create new database `CREATE DATABASE reporting_dashboard_dev;`
- Create a new role with password `CREATE ROLE reporting_dashboard_role WITH LOGIN PASSWORD 'reportingdashboard123';`

### Setup and run locally using

```
./scripts/setup-local.sh
```

### Build and run docker container locally

```
docker-compose down
docker-compose build
docker-compose up
```

### Develop locally

```
yarn start:local
```

### Start dev server

```
yarn dev
```

### Start prod server

```
yarn prod
```

### Build the application

```
yarn build
```
