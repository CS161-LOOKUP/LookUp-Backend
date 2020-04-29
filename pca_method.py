# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pandas as pd
import csv
import json
import sys
from sklearn.decomposition import PCA
import numpy as np


# %%
input = sys.stdin.readlines()
dataInString = input[0]
datalist = list(map(int, dataInString.split()))

with open('./user.json') as json_file:
    data = json.load(json_file)
data_file = open('data_file.csv', 'w')
csv_writer = csv.writer(data_file)
count = 0
for user in data:
    if count == 0:
        header = user.keys()
        csv_writer.writerow(header)
        count += 1
    csv_writer.writerow(user.values())
data_file.close()
data = pd.read_csv('./data_file.csv')


# %%
model = PCA(n_components=3)


# %%
model.fit(data.to_numpy()[:,1:].astype(float))

# %% [markdown]
# Test

# %%

transformed_data = model.transform(data.to_numpy()[:,1:].astype(float))

def get_neighbors(user, top_n):
    transformed = model.transform(np.array(user).reshape(1, 12))
    #transformed = model.transform(user.reshape(1, 12))
    #transformed = model.transform(np.array(user))
    dists = sorted(zip(np.sum((transformed_data - transformed)**2, axis=1), data['id']))
    return [name for d,name in dists[:top_n]]
    
    


# %%
print(get_neighbors(datalist, 10))


# %%


