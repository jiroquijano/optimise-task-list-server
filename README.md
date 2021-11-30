# Optimise-taskboard-client
Express backend application for the taskboard application. Uses optimise-taskboard-client as frontend.

### Node version
- use node versions higher than v10

### Environment variables
- MONGO_URL - connection string to MongoDB database
- PORT - port to listen for requests
- CHECK_DUE_INTERVAL - interval for checking if tasks are due (in ms)

## Running the server on local machine (option 1)
1. cd into root directory of optimise-task-list-server
2. install npm dependencies `npm i`
3. set the environment variables (MONGO_URL, PORT, CHECK_DUE_INTERVAL) under 'dev.env' config file, then run the application via `npm run start`
    - or alternatively, supply the env variable info on npm run like so:
    - `export MONGO_URL="mongodb connection string" && npm run start

## Running the dockerized version of the server on local machine (option 2)
1. cd into root directory of optimise-task-list-server
2. set the environment variables (MONGO_URL [required], CHECK_DUE_INTERVAL [optional]) in the 'dev.env' config file
3. build the docker image via `docker build -t taskboard-server .` command
4. run the built docker image via `docker run -p 4000:4000 --name taskboard-server-app taskboard-server`.

## Running tests on local machine
1. update the MONGO_URL connection string under 'test.env' config file.
    - IMPORTANT: make sure that the connection string in 'test.env' is different to 'dev.env' to avoid messing up with main application DB when running tests
2. run testcases via `npm run test`
