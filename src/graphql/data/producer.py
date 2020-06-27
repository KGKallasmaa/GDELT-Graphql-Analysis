#!/usr/bin/python
# -*- coding: utf-8 -*-

import convert as c
from json import dumps
from kafka import KafkaProducer
import schedule
import threading
import time

KAFKA_ACTOR_BROKER = 'localhost:9092'
KAFKA_EVENT_BROKER = 'localhost:9093'


def csvProducer_actor(converted_files):
    csvDict = {
        "topic": "Actor",
        "key": "Actor",
        "csvDelimeter": r'"',
        "kafkaHost": KAFKA_ACTOR_BROKER,
        "clientID": "ActorProducer",
        "waitTime": 3
    }

    producer = KafkaProducer(
        bootstrap_servers=csvDict["kafkaHost"],
        value_serializer=lambda x: dumps(x).encode('utf-8'),
        key_serializer=str.encode,
        api_version=(0, 10),
        client_id=csvDict["clientID"],
        acks=1,
        compression_type="gzip",
        batch_size=16384,
        buffer_memory=33554432)

    i = 0
    for line in converted_files:
        producer.send(topic=csvDict["topic"], value=line, key=csvDict["topic"])
        i += 1
    print("Sent {} messages to the Events topic".format(i))


def csvProducer_event(converted_files):
    csvDict = {
        "topic": "Event",
        "key": "Event",
        "csvDelimeter": r'"',
        "kafkaHost": KAFKA_EVENT_BROKER,
        "clientID": "EventProducer",
        "waitTime": 3
    }

    producer = KafkaProducer(
        bootstrap_servers=csvDict["kafkaHost"],
        value_serializer=lambda x: dumps(x).encode('utf-8'),
        key_serializer=str.encode,
        api_version=(0, 10),
        client_id=csvDict["clientID"],
        acks=1,
        compression_type="gzip",
        batch_size=16384,
        buffer_memory=33554432
    )

    i = 0
    for line in converted_files:
        producer.send(topic=csvDict["topic"], value=line, key=csvDict["topic"])
        i += 1
    print("Sent {} messages to the Events topic".format(i))


def producer():
    extracted_csv_files = c.download_csv()
    for csv in extracted_csv_files:
        # TODO: implement multi trhearding
        converted_file = c.convert(csv)
        csvProducer_event(converted_file)
        csvProducer_actor(converted_file)
    c.delete_files()


def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()


if __name__ == "__main__":
    schedule.every(15).minutes.do(run_threaded, producer)

    fifteen_minutes_in_ms = 900000
    while 1:
        schedule.run_pending()
        time.sleep(fifteen_minutes_in_ms)
