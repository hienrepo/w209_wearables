import pandas as pd
import datetime as dt

def parse():
    project = pd.read_csv('data/apple_health_export.csv')
    filter  = project[(project['type']=="DistanceWalkingRunning") | (project['type']=="HeartRate")| (project['type']=="VO2Max") ]
    filter['time'] = pd.to_datetime(filter['startDate'])
    filter['dates'] = filter['time'].dt.date
    project = filter[["type", "value","dates"]]
    project = project.dropna()
    print(project.dtypes)
    project["value"] = pd.to_numeric(project["value"], downcast="float")
    aggregate= project.groupby(by=["type","dates"])["value"].agg('mean').to_frame(name='value').reset_index()
    transpose = aggregate.pivot(index='dates', columns='type', values='value')
    transpose.to_csv('data/activity_correlations_export.csv')


