### Get the mongo image from docker hub ###
docker pull mongo 

### Create the node and car-app images ###
docker build -t car-app ./

### Run the mongodb image first, then run the app and link the mongodb to it ###
docker run -it --name mongodb mongo
docker run -it -p 3000:3000 --name leoCarApp --link=mongodb:mongodb car-app