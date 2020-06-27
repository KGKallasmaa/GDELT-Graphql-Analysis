#!/bin/bash
echo "Installing Python dependencies"
pip install -r requirements.txt
echo "Starting the Kafka producer"
cd src/graphql/data/ || exit
python producer.py
