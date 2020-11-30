import pandas as pd
import datetime as dt
import json
import time

def generate_scatter_data(dataset):
        filter  = dataset[(dataset['type']=="DistanceWalkingRunning") | (dataset['type']=="HeartRate")| (dataset['type']=="StepCount") ]
        filter['date'] = pd.to_datetime(filter['startDate']).dt.strftime('%Y-%m-%d %H')
        filter["value"] = pd.to_numeric(filter["value"], downcast="float")
        project = filter[["type", "value","date"]]
        aggregate= project.groupby(by=["type","date"])["value"].agg('mean').to_frame(name='value').reset_index()
        print(aggregate)
        transpose = aggregate.pivot(index='date', columns='type', values='value')
        transpose = transpose.dropna()
        print(transpose)
        transpose.to_csv('static/data/data_scatter.csv')

def generate_basal_data(dataset):
        filter  = dataset[(dataset['type']=="DistanceWalkingRunning") | (dataset['type']=="BasalEnergyBurned")| (dataset['type']=="StepCount") ]
        filter['date'] = pd.to_datetime(filter['startDate']).dt.strftime('%Y-%m-%d %H')
        filter["value"] = pd.to_numeric(filter["value"], downcast="float")
        project = filter[["type", "value","date"]]
        aggregate= project.groupby(by=["type","date"])["value"].agg('mean').to_frame(name='value').reset_index()
        print(aggregate)
        transpose = aggregate.pivot(index='date', columns='type', values='value')
        transpose = transpose.dropna()
        print(transpose)
        transpose.to_csv('static/data/data_basal.csv')

def generate_trend_data(dataset):
        filter  = dataset[(dataset['type']=="DistanceWalkingRunning") | (dataset['type']=="HeartRate")| (dataset['type']=="StepCount") ]
        filter['date'] = pd.to_datetime(filter['startDate']).dt.strftime('%m/%d/%y')
        filter["value"] = pd.to_numeric(filter["value"], downcast="float")
        project = filter[["type", "value","date"]]
        aggregate= project.groupby(by=["type","date"])["value"].agg('mean').to_frame(name='value').reset_index()
        print(aggregate)
        transpose = aggregate.pivot(index='date', columns='type', values='value')
        #transpose = transpose.dropna()
        print(transpose)
        transpose.to_csv('static/data/data_trend.csv')

def generate_summary_data(dataset):
        output={}
        project = dataset[["type", "value","startDate"]]
        output['rows'] = project.shape[0]
        output['start'] = pd.to_datetime(project['startDate']).dt.date.min().strftime('%m/%d/%Y')
        output['end'] = pd.to_datetime(project['startDate']).dt.date.max().strftime('%m/%d/%Y')
        print('Number of Rows: ' , project.shape[0] )
        print ('Start Date:' , pd.to_datetime(project['startDate']).dt.date.min())
        print ('End Date: ' , project['startDate'].max())
        ave_hr = project[project['type']=="HeartRate"]['value'].astype(float).mean()
        print (ave_hr)
        output['hrave'] = ave_hr
        ave_be = project[project['type']=="BasalEnergyBurned"]['value'].astype(float).mean()
        print (ave_be)
        output['beave'] = ave_be

        filter = project[project['type']=="DistanceWalkingRunning"]
        filter['time'] = pd.to_datetime(filter['startDate'])
        filter['dates'] = filter['time'].dt.date
        filter = filter[["type", "value","dates"]]
        filter = filter.dropna()
        filter["value"] = pd.to_numeric(filter["value"], downcast="float")
        aggregate= filter.groupby(by=["type","dates"])["value"].agg('mean').to_frame(name='value').reset_index()
        ave_dw = aggregate['value'].mean()
        print(ave_dw)
        output['dwave'] = ave_dw

        filter1 = project[project['type']=="StepCount"]
        filter1['time'] = pd.to_datetime(filter1['startDate'])
        filter1['dates'] = filter1['time'].dt.date
        filter1 = filter1[["type", "value","dates"]]
        filter1 = filter1.dropna()
        filter1["value"] = pd.to_numeric(filter1["value"], downcast="float")
        aggregate= filter1.groupby(by=["type","dates"])["value"].agg('mean').to_frame(name='value').reset_index()
        ave_sc = aggregate['value'].mean()
        print(ave_sc)
        output['scave'] = ave_sc
        #print(output)
        print(str(output))
        with open('static/data/data_summary.json', 'w') as json_file:
                json_file.write(str(output).replace("'", '"'))
                #json.dump(output, json_file)

def parse():
        start_time = time.time()
        dataset = pd.read_csv('static/data/all_data.csv')
        generate_scatter_data(dataset)
        generate_trend_data(dataset)
        generate_basal_data(dataset)
        generate_summary_data(dataset)
        print("---Total Time  %s seconds ---" % (time.time() - start_time))
if __name__ == "__main__":
	parse()
