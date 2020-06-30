# GDELT-Graphql-Analysis ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)


In this project we're analysing GDELT data with GraphQL. GDELT is a free, constantly-updating data source that publishes world-event data every 15 minutes.


The project was done by:
1. Riccardo [https://github.com/riccardotommasini]
2. Maxim [https://github.com/MaximSantalov]
3. Karl-Gustav [https://github.com/KGKallasmaa]

The project was part of the Big Data Management course at the University of Tartu.
You can read more about on <a href="https://medium.com/@karl.gustav1789/extracting-knowledge-from-gdelt-3f4aaf4ddda1">Medium<a/>

## Required software

Docker <br/>
Python 3.5 <br/>
Node.js <br/>

## Running the project locally, from scratch

All of the commands in this block should be run sequentially each int its separate Terminal window.

1. Starting the Kafka cluster and database
```bash
bash kafka_cluster.sh
```
2. Starting the Kafka producer
```bash
bash producer.sh
```
3. Starting the Kafka consumer
```bash
bash consumer.sh
```
4. Starting the production-server
```bash
bash server.sh
```

## Running the development server (after server.sh)
```javascript
nodemon src/server.jsx
```

## Queries

Navigate to localhost:3000. There you can find the GraphQl GUI. It's advisable that you study src/graphql/schema.jsx before hand. 

There are currently 10 queries:
1. <b>everything()</b> -> returns every value in the database
2. <b>top_nr_source(n:Int)</b> -> returns top n value with the most sources
3. <b>get_results_between_time_periods(FractionDate_start:Float,FractionDate_end:Float)</b> -> returns the results between 2 dates
4. <b>get_results_between_tones(min_tone:Float,max_tone:Float)</b> -> returns the results between 2 tone values
5. <b> get_actions_month(month:String)</b> -> returns the actions within a given month

6. <b>get_data_with_n_events_happend_in_dates(n:Int, start_SQLDATE:String, end_SQLDATE:String)</b> -> returns the values that happened between two dates and that had at least n events in a month
7. <b>get_top_n_actors_with_most_mentions_per_day(n:Int,start_SQLDATE:String,end_SQLDATE:String)</b> -> returns n actors per day between the two dates sorted by the nr of mentions
8. <b>get_top_n_negative_actors_near_location(n:Int,
                                                  actor1Geo_Lat:Float,actor1Geo_Long:Float,
                                                  start_SQLDATE:String,end_SQLDATE:String)</b> -> returns the top n values for every day between two dates that happened within 100 km of the given location
9. <b>find_n_most_powerful_actor_events_using_pagerank_between_two_dates(n:Int,start_SQLDATE:String,end_SQLDATE:String)</b> -> returns the most powerful actors between two dates determined by the PageRank algorithm
10. <b>find_n_most_powerful_domains_between_two_dates(n:Int,start_SQLDATE:String,end_SQLDATE:String,Geo_Lat:Float,Geo_Long:Float)</b> -> returns n most powerful news sites within 1,000 km of the given location between the 2 dates


## Executing queries

Example 1
```GraphQL
{
  everything {
    GLOBALEVENTID
  }
}
```
```GraphQL
{
  "data": {
    "everything": [
      {
        "GLOBALEVENTID": "932366174"
      },
      {
        "GLOBALEVENTID": "932366175"
      },
     ...
        ]
    }
}
```
Example 2
```GraphQL
{
  get_top_n_actors_with_most_mentions_per_day(n: 5, start_SQLDATE: "20200520", end_SQLDATE: "20200701") {
    SQLDATE
    events {
      Actor1Name
    }
  }
}

```
```GraphQL
{
  "data": {
    "get_top_n_actors_with_most_mentions_per_day": [
      {
        "SQLDATE": "20200531",
        "events": [
          {
            "Actor1Name": "CROATIA"
          },
          {
            "Actor1Name": "AMIT"
          },
          {
            "Actor1Name": "LAWYER"
          },
          {
            "Actor1Name": "AMIT"
          },
          {
            "Actor1Name": "NEW SOUTH WALES"
          }
        ]
      },
      ...
    ]
  }
}
```
Example 3
```GraphQL
{
  find_n_most_powerful_domains_between_two_dates(n: 5,
                                                 start_SQLDATE: "20200601", end_SQLDATE: "20200701",
                                                 Geo_Lat: 51.5074, Geo_Long: 0.1278)
}
```
```GraphQL
{
  "data": {
    "find_n_most_powerful_domains_between_two_dates": [
      "express.co.uk",
      "famagusta-gazette.com",
      "telegraph.co.uk",
      "dw.com",
      "sbs.com.au"
    ]
  }
}
```
### Contributing


We're happy if you want to contribute to this project. Github <a href="https://github.com/github/super-linter/">Super-linter</a> analyses the code before hand.


## Problems

With docker-compose : 'ERROR: Version in "./docker-compose.yml" is unsupported' 
(1) sudo apt-get remove docker-compose OR sudo rm /usr/local/bin/docker-compose

(2) sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

(3) sudo chmod +x /usr/local/bin/docker-compose

(4) sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

