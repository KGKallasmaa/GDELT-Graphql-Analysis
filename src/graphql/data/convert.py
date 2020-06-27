#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import io
import zipfile
import glob
from bs4 import BeautifulSoup
import requests
import os

from pymongo import MongoClient


def get_gdelt_collection():
    client = MongoClient(host="127.0.0.1",
                         port=27017,
                         username="username",
                         password="password",
                         authSource="admin")
    db = client['gdelt-database']
    collection = db.events
    return collection


def get_lables():
    return ["GLOBALEVENTID", "SQLDATE", "MonthYear", "Year", "FractionDate", "Actor1Code", "Actor1Name",
            "Actor1CountryCode", "Actor1KnownGroupCode", "Actor1EthnicCode", "Actor1Religion1Code",
            "Actor1Religion2Code", "Actor1Type1Code",
            "Actor1Type2Code", "Actor1Type3Code", "Actor2Code", "Actor2Name", "Actor2CountryCode",
            "Actor2KnownGroupCode",
            "Actor2EthnicCode", "Actor2Religion1Code", "Actor2Religion2Code", "Actor2Type1Code", "Actor2Type2Code",
            "Actor2Type3Code", "IsRootEvent", "EventCode", "EventBaseCode", "EventRootCode", "QuadClass",
            "GoldsteinScale", "NumMentions", "NumSources", "NumArticles", "AvgTone", "Actor1Geo_Type",
            "Actor1Geo_FullName", "Actor1Geo_CountryCode", "Actor1Geo_ADM1Code", "Actor1Geo_ADM2Code",
            "Actor1Geo_Lat", "Actor1Geo_Long", "Actor1Geo_FeatureID", "Actor2Geo_Type", "Actor2Geo_FullName",
            "Actor2Geo_CountryCode", "Actor2Geo_ADM1Code", "Actor2Geo_ADM2Code", "Actor2Geo_Lat", "Actor2Geo_Long",
            "Actor2Geo_FeatureID", "ActionGeo_Type", "ActionGeo_FullName ", "ActionGeo_CountryCode",
            "ActionGeo_ADM1Code", "ActionGeo_ADM2Code",
            "ActionGeo_Lat", "ActionGeo_Long", "ActionGeo_FeatureID", "DATEADDED", "SOURCEURL"]


def convert(file):
    print("Starting to extract GDELT data from {} ".format(file))
    return_data = []

    labels = get_lables()

    with open(file, 'r') as f:
        reader = csv.reader(f, delimiter='\t')
        for (i, line) in enumerate(reader):
            dictionary = dict(zip(labels, line))
            # Removing properties that are empty
            value_is_not_empty = lambda v: len(v) > 0 and v is not None
            dictionary = {k: v for k, v in dictionary.items() if value_is_not_empty(v.strip())}

            # Data will be stored under the events collections
            return_data.append(dictionary)

    return return_data



def delete_files():
    csv_files = glob.glob("*.CSV")
    zip_files = glob.glob("*.zip")

    for c in csv_files:
        if os.path.exists(c):
            os.remove(c)

    for z in zip_files:
        if os.path.exists(z):
            os.remove(z)


def extract_zip():
    all_files = os.listdir()

    for f in all_files:
        if ".zip" == f[-4:]:
            abs_path = os.path.abspath(f)
            try:
                with zipfile.ZipFile(abs_path, 'r') as file:
                    file.printdir()
                    file.extractall()
            except zipfile.BadZipFile:
                print('Error: Zip file is corrupted')
            except zipfile.LargeZipFile:
                print('Error: File size if too large')


def download():
    url = "http://data.gdeltproject.org/gdeltv2/lastupdate.txt"

    html = requests.get(url)
    soup = BeautifulSoup(html.text, "html.parser")

    print("Extracting ZIP files")

    link = soup.get_text().split()[2]

    if any(link.endswith(x) for x in ['.zip']):
        # We need to keep the headings in mind

        print("Downloading '{}'".format(url + "/" + link))
        written_file = _download_chunks("./", link)
        out_path = _unzip_file("./", written_file)

    print("Done downloading the zip files")
    return out_path


def _unzip_file(directory, zipped_file):
    try:
        z = zipfile.ZipFile(zipped_file)
        for name in z.namelist():
            f = z.open(name)
            out_path = os.path.join(directory, name)
            with io.open(out_path, 'w', encoding='utf-8') as out_file:
                content = f.read().decode('utf-8')
                out_file.write(content)

    except zipfile.BadZipfile:
        print('Bad zip file for {}, passing.'.format(zipped_file))
    return out_path


def _download_chunks(directory, url):
    base_file = os.path.basename(url)
    temp_path = directory
    try:
        local_file = os.path.join(temp_path, base_file)

        req = requests.get(url, stream=True)
        with io.open(local_file, 'wb') as fp:
            for chunk in req.iter_content(chunk_size=1024):
                if chunk:
                    fp.write(chunk)
    except requests.exceptions.HTTPError as e:
        print("HTTP Error: {}; {}".format(e, url))
    except requests.exceptions.URLError as e:
        print("URL Error: {}; {}".format(e, url))

    return local_file


def download_csv():
    download()
    return glob.glob("*.CSV")