#!/bin/bash
echo "Deleting old files"
rm -R zk-multiple-kafka-multiple
rm -R mongodb
echo "Building the Kafka cluster and MongoDB"
docker-compose build "$@"--parallel
echo "Running the Kafka cluster and MongoDB"
docker-compose up