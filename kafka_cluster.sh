#!/bin/bash
echo "Building the Kafka cluster and MongoDB"
docker-compose build "$@"--parallel
docker-compose up