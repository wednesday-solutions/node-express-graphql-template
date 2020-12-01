#!/bin/bash
set -a . ".env.$ENVIRONMENT_NAME" set +a
sleep 10

LOCAL="local"
if [ $ENVIRONMENT_NAME = $LOCAL ]
    then 
        npx sequelize db:drop
        npx sequelize db:create
fi
npx sequelize db:migrate
# seed data for local builds 
if [ $ENVIRONMENT_NAME = $LOCAL ]
    then 
        for file in seeders/*
        do
        :
        npx sequelize db:seed --seed $file
        done
fi

yarn build:$ENVIRONMENT_NAME
yarn start