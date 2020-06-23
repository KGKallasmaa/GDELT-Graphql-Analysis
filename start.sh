#!/bin/bash
echo "Installing Python dependencies"
pip install -r requirements.txt
echo "Starting to download .CSV files"
cd src/graphql/data/ || exit
python convert.py
rm *.zip
rm *.CSV
cd ..
cd ..
echo "Installing Node dependencies"
npm install
echo "Start the server"
npm start
