'''
creates an object matching country names to their country's 3-letter id
'''

import glob
import json

countries = []

src = 'world.geo.json'

for filename in glob.iglob(src + '/countries/*.geo.json'):
  json_data = open(filename)
  data = json.load(json_data)
  country = data['features'][0];
  countries.append( [ country['properties']['name'], country['id'] ] )
  json_data.close()

with open('ids.json', 'wb') as fp:
    json.dump(countries, fp)