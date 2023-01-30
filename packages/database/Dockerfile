FROM mongo:latest

COPY seed/stations.json /stations.json

COPY seed/journeys.json /journeys.json

CMD mongoimport --uri mongodb://mongodb:27017/citybiker --collection Station --jsonArray --drop --file /stations.json && \
     mongoimport --uri mongodb://mongodb:27017/citybiker --collection Journey --jsonArray --drop --file /journeys.json
