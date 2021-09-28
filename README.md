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

## A relay compliant server built using

- Node
- Express
- Postgres
- GraphQL
- Docker

## Dependencies

### graphql-sequelize

Please go through the [documentation](https://github.com/mickhansen/graphql-sequelize) to understand the control flow.

Relay support has been added by following [this](https://github.com/mickhansen/graphql-sequelize/blob/master/docs/relay.md) documentation

## Setup

### Setup and run locally using

```
./setup-local.sh
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
