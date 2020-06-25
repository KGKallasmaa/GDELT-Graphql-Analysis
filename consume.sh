#!/bin/bash
echo "Installing Python dependencies"
pip install -r requirements.txt
echo "Starting the Kafka consumer"
cd src/graphql/data/ || exit
python consume.py
