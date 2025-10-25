#!/bin/bash

# Enable all incoming and routed traffic
iptables -A INPUT -j ACCEPT
iptables -A FORWARD -j ACCEPT

# Set home directory to save docker credentials
export HOME=/home/appuser

# Configure docker with credentials for gcr.io and pkg.dev
docker-credential-gcr configure-docker

# A name for the container
CONTAINER_NAME="my-app-container"

# Stop and remove the container if it exists
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Pull the latest version of the container image
docker pull gcr.io/danmage/web:latest

# Run docker container from image in docker hub
docker run   --name=$CONTAINER_NAME   --privileged   --restart=always   --tty   --detach   --network="host"   --log-driver=gcplogs   gcr.io/danmage/web:latest
