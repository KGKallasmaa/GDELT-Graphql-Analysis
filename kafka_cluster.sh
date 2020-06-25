#!/bin/bash
echo "Building the Kafka cluster and MongoDB"
docker-compose build "$@"--parallel
echo "Starting the Kafka cluster and MongoDB"
docker-compose up