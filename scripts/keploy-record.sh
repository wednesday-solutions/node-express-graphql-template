curl -O https://raw.githubusercontent.com/keploy/keploy/main/keploy.sh && source keploy.sh

docker volume create --driver local --opt type=debugfs --opt device=debugfs debugfs

docker network create keploy-network

alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v debugfs:/sys/kernel/debug:rw -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy'

keploy record -c "docker run -p 9000:9000 --name negt --network keploy-network  node-express-graphql-template-app" --buildDelay 2m