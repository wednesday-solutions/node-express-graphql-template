#!/bin/bash
sleep 10
./node_modules/.bin/sequelize db:drop
./node_modules/.bin/sequelize db:create
./node_modules/.bin/sequelize db:migrate

for file in seeders/*
do
   :
   ./node_modules/.bin/sequelize db:seed --seed $file
done

yarn build
yarn dev