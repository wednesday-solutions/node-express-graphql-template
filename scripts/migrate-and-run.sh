#!/bin/sh
set -a . ".env.$ENVIRONMENT_NAME" set +a
sleep 10
echo $ENVIRONMENT_NAME
if [ "$ENVIRONMENT_NAME" == "local" ]
then
    npx sequelize-cli db:drop
    npx sequelize-cli db:create
fi

npx sequelize-cli db:migrate

# seed data for local builds
if [ "$ENVIRONMENT_NAME" == "local" ]
then
    for file in seeders/*
    do
        :
        npx sequelize-cli db:seed --seed $file
    done
fi

yarn start