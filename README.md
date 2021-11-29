# Optimise-taskboard-client
Express backend application for the taskboard application. Uses optimise-taskboard-client as frontend.

### Node version
- use node versions higher than v10

### Environment variables
- MONGO_URL - connection string to MongoDB database
- PORT - port to listen for requests
- CHECK_DUE_INTERVAL - interval for checking if tasks are due (in ms)

### Running the server on local machine
1. cd into root folder of optimise-task-list-server
2. install npm dependencies `npm i`
3. set the environment variables (MONGO_URL, PORT, CHECK_DUE_INTERVAL) under 'dev.env' config file, then run the application via `npm run start`
    - or alternatively, supply the env variable info on npm run like so:
    - `export MONGO_URL="<<connection string>>" && npm run start

### Running tests on local machine
1. update the MONGO_URL connection string under 'test.env' config file.
    - IMPORTANT: make sure that the connection string in 'test.env' is different to 'dev.env' to avoid messing up with main application DB when running tests
2. run testcases via `npm run test`
