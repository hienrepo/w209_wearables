import pandas as pd

def parse():
    print("Creating heart rate file...", end="")
    data = pd.read_csv("static/data/apple_health_export.csv")
    data = data[data['type'] == "HeartRate"]
    data = data[['startDate', 'value']]
    data.to_csv("static/data/heart_rate_export.csv", index=False)
    print("done!")
    return
