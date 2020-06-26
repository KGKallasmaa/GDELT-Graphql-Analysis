import convert as c
from time import sleep
from json import dumps
import csv,json
from kafka import KafkaProducer
import schedule
import threading
import time

def csvProducer_actor(out_path):
    csvDict = {
                "topic": "Actor",
                "key": "Actor",
                "csvFile": "{}".format(out_path),
                "csvDelimeter": r'"', 
                "kafkaHost": "localhost:9092",
                "clientID": "ActorProducer",
                "waitTime": 3
            }

    producer = KafkaProducer(
            bootstrap_servers=csvDict["kafkaHost"],
            value_serializer=lambda m: m.encode('utf-8'),
            key_serializer=str.encode,
            api_version=(0,10),
            client_id=csvDict["clientID"],
            acks=1,
            compression_type="gzip",
            batch_size=16384,
            buffer_memory=33554432,
            )

    with open(csvDict["csvFile"]) as csvStream:
        for csvRow in csv.reader(csvStream, delimiter=csvDict["csvDelimeter"]):
            csvLine = json.dumps(csvRow)
            print("Sent csv record to kafka with values:\n\t%s" % csvLine)
          
            producer.send(topic=csvDict["topic"], value=csvLine, key=csvDict["topic"])
               
            
def csvProducer_event(out_path):
    csvDict = {
                "topic": "Event",
                "key": "Event",
                "csvFile": "{}".format(out_path),
                "csvDelimeter": r'"', 
                "kafkaHost": "localhost:9093",
                "clientID": "EventProducer",
                "waitTime": 3
            }

    producer = KafkaProducer(
            bootstrap_servers=csvDict["kafkaHost"],
            value_serializer=lambda m: m.encode('utf-8'),
            key_serializer=str.encode,
            api_version=(0,10),
            client_id=csvDict["clientID"],
            acks=1,
            compression_type="gzip",
            batch_size=16384,
            buffer_memory=33554432,
            )

    with open(csvDict["csvFile"]) as csvStream:
        for csvRow in csv.reader(csvStream, delimiter=csvDict["csvDelimeter"]):
            csvLine = json.dumps(csvRow)
            print("Sent csv record to kafka with values:\n\t%s" % csvLine)
            producer.send(topic=csvDict["topic"], value=csvLine, key=csvDict["topic"])
             
            
            
def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()

if __name__ == "__main__":
    out_path,data = c.download_csv() 
    schedule.every(15).minutes.do(run_threaded, csvProducer_event(out_path))
    schedule.every(15).minutes.do(run_threaded, csvProducer_actor(out_path))

    while 1:
        schedule.run_pending()
        time.sleep(1)
    
