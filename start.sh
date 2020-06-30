# !bin/bash
echo "Running kafka cluster"
bash kafka_cluster.sh &
echo "Starting server"
bash server.sh &
