#!/usr/bin/python
# -*- coding: utf-8 -*-

from kafka import KafkaConsumer
from json import loads
import schedule
from pymongo import MongoClient
import time
import threading

KAFKA_ACTOR_BROKER = 'localhost:9092'
KAFKA_EVENT_BROKER = 'localhost:9093'


def get_gdelt_db():
    client = MongoClient(host="127.0.0.1",
                         port=27017,
                         username="username",
                         password="password",
                         authSource="admin")
    db = client['gdelt-database']
    return db


def consume_actor():
    db = get_gdelt_db()
    actor_collection = db.actor

    consumer = KafkaConsumer(
        'Actor',
        bootstrap_servers=[KAFKA_ACTOR_BROKER],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='actor-group',
        consumer_timeout_ms=10000,  # 10 sec
        value_deserializer=lambda x: loads(x.decode('utf-8')))

    i = 0
    for message in consumer:
        message = message.value
        actor_collection.insert_one(message)
        i += 1
    print("Added {} messages to the Actor topic".format(i))


def consume_event():
    db = get_gdelt_db()
    event_collection = db.events

    consumer = KafkaConsumer(
        'Event',
        bootstrap_servers=[KAFKA_EVENT_BROKER],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='event-group',
        consumer_timeout_ms=10000,  # 10 sec
        value_deserializer=lambda x: loads(x.decode('utf-8')))

    i = 0
    for message in consumer:
        message = message.value
        event_collection.insert_one(message)
        i += 1
    print("Added {} messages to the Events topic".format(i))


def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()


if __name__ == '__main__':
    schedule.every(16).minutes.do(run_threaded, consume_actor)
    schedule.every(16).minutes.do(run_threaded, consume_event)



    sixteen_minutes_in_s = 960
    while 1:
        schedule.run_pending()
        time.sleep(sixteen_minutes_in_s)
