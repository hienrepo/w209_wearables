import pandas as pd
import numpy as np

def parse():
    print("Creating flights and steps file...", end="")
    data = pd.read_csv("static/data/apple_health_export.csv")

    fs_data = pd.DataFrame()
    
    data = data[(data['type'] == 'FlightsClimbed') | (data['type'] == 'StepCount')]
    data['startDate'] = data['startDate'].str.slice(stop=10)
    data['value'] = data['value'].astype('int64')
    pivot = pd.pivot_table(data, values='value', index='startDate', columns='type', aggfunc=np.sum, fill_value=0)
    pivot.to_csv("static/data/flights_steps_export.csv")
    print("done!")
    return
