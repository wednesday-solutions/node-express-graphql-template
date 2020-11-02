#!/bin/sh

export ENVIRONMENT_NAME=local
export NODE_ENV=local
npx sequelize db:drop
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
yarn start:local