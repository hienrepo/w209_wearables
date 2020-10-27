#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple Apple Health XML to CSV
==============================
:File: convert.py
:Description: Convert Apple Health "export.xml" file into a csv
:Version: 0.0.1
:Created: 2019-10-04
:Authors: Jason Meno (jam)
:Dependencies: An export.xml file from Apple Health
:License: BSD-2-Clause
"""

# %% Imports
import pandas as pd
import xml.etree.ElementTree as ET
import heart_rate_parser
import activity_correlations_parser

# %% Function Definitions
def pre_process():
    """Pre-processes the XML file by replacing specific bits that would
    normally result in a ParseError
    """

    print("Pre-processing...", end="")
    with open("data/export.xml") as f:
        newText = f.read().replace("\x0b", "")

    with open("data/processed_export.xml", "w") as f:
        f.write(newText)

    print("done!")

    return


def convert_xml():
    """Loops through the element tree, retrieving all objects, and then
    combining them together into a dataframe
    """

    print("Converting XML file...", end="")
    etree = ET.parse("data/processed_export.xml")

    attribute_list = []

    for child in etree.getroot():
        child_attrib = child.attrib
        for metadata_entry in list(child):
            metadata_values = list(metadata_entry.attrib.values())
            if len(metadata_values) == 2:
                metadata_dict = {metadata_values[0]: metadata_values[1]}
                child_attrib.update(metadata_dict)

        attribute_list.append(child_attrib)

    health_df = pd.DataFrame(attribute_list)

    health_df.type = health_df.type.str.replace('HKQuantityTypeIdentifier', "")
    health_df.type = health_df.type.str.replace('HKCategoryTypeIdentifier', "")
    health_df.columns = health_df.columns.str.replace("HKCharacteristicTypeIdentifier", "")

    original_cols = list(health_df)
    shifted_cols = ['type',
                    'sourceName',
                    'value',
                    'unit',
                    'startDate',
                    'endDate',
                    'creationDate']

    if 'com.loopkit.InsulinKit.MetadataKeyProgrammedTempBasalRate' in original_cols:
        shifted_cols.append('com.loopkit.InsulinKit.MetadataKeyProgrammedTempBasalRate')

    if 'com.loopkit.InsulinKit.MetadataKeyScheduledBasalRate' in original_cols:
        shifted_cols.append('com.loopkit.InsulinKit.MetadataKeyScheduledBasalRate')

    if 'com.loudnate.CarbKit.HKMetadataKey.AbsorptionTimeMinutes' in original_cols:
        shifted_cols.append('com.loudnate.CarbKit.HKMetadataKey.AbsorptionTimeMinutes')

    remaining_cols = list(set(original_cols) - set(shifted_cols))
    reordered_cols = shifted_cols + remaining_cols
    health_df = health_df.reindex(labels=reordered_cols, axis='columns')

    health_df = health_df[['startDate', 'value', 'type']]
    health_df.sort_values(by='startDate', ascending=False, inplace=True)
    health_df = health_df.reset_index(drop=True)

    last_date = health_df['startDate'][0]
    if last_date[6:7] == "01":
        first_date = str(int(last_date[:4]) - 1) + "-12" + last_date[7:]
    else:
        first_date = last_date[:5] + str(int(last_date[6:7]) - 1).zfill(2) + last_date[7:]
    
    health_df = health_df[(health_df['startDate'] > first_date)]    

    print("done!")

    return health_df


def save_to_csv(health_df):
    print("Saving CSV file...", end="")
    health_df.to_csv("data/apple_health_export.csv", index=False)
    print("done!")

    return


def main():
    pre_process()
    health_df = convert_xml()
    save_to_csv(health_df)
    heart_rate_parser.parse()
    activity_correlations_parser.parse()

    return


# %%
if __name__ == '__main__':
    main()
