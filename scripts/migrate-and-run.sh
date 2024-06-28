#!/bin/sh
set -a
. ".env.$ENVIRONMENT_NAME"
set +a

# Function to handle SIGINT signal
handle_int() {
    echo "SIGINT received, forwarding to child process..."
    kill -INT "$child" 2>/dev/null
    echo "Waiting for child process to exit..."
    wait "$child"
    echo "Child process exited. Waiting for NYC coverage data to be fully written..."
    sleep 10  # Wait for 50 seconds
    echo "Exiting after delay..."
    exit 0
}

# Trap SIGINT signal
trap 'handle_int' INT TERM

sleep 10  # 
echo $BUILD_NAME
if [ "$BUILD_NAME" == "local" ]
then
    npx sequelize-cli db:drop
    npx sequelize-cli db:create
fi

npx sequelize-cli db:migrate

# seed data for local builds
if [ "$BUILD_NAME" == "local" ]
then
    for file in seeders/*
    do
        :
        npx sequelize-cli db:seed --seed $file
    done
fi

yarn start &

child=$!
echo "Started yarn with PID $child"

# Wait for child process to finish
wait "$child"
