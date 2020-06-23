echo "Deleting old DB fails"
rm -R mongodb
echo "Building mongodb database"
docker-compose build
echo "Starting mongodb database"
docker-compose up
