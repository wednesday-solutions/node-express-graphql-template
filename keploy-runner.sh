#!/bin/bash -x -i -e

# Command to be executed
alias keploy="docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v debugfs:/sys/kernel/debug:rw -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v /Users/apple/.keploy:/root/.keploy --rm docker.io/keploy/enterprise"

# Number of times to run the command
ITERATIONS=10

# Loop to execute the command
for (( i=1; i<=$ITERATIONS; i++ ))
do
    echo "Running iteration $i"
    keploy test -c 'docker compose --env-file .env.docker up' --containerName "fast-api-app" --delay 30 --freezeTime --testsets='test-set-1'
    echo "Iteration $i complete"
    echo "----------------------------------------"
done

echo "Script execution complete"