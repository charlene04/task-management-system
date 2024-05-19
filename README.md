# Task Management System API

## Description
This project is built to allow users to create multiple tasks with varying priorities in order to facilitate effective management.
Here are the premises it is basaed on:

- A particular user can create multiple tasks
- A particular user can ONLY browse through/update the tasks they created
- Multiple clients (terminal) can connect to a websocket endpoint to view live data of currently available tasks (this needs improvements as stated [here](https://github.com/charlene04/task-management-system#connecting-a-web-socket-client))


## Project Setup
### Prerequisites
Before you begin, ensure you have the following installed on your local machine:

- Node.js (v18)
- npm (Node Package Manager)
- PostgreSQL


### Setting Up PostgreSQL Locally
Install PostgreSQL:

Follow the instructions on the [official PostgreSQL website](https://www.postgresql.org/download/) to download and install PostgreSQL for your operating system.


### Create a Database:

Open your PostgreSQL terminal (psql) or use a GUI tool like pgAdmin.
- Run the following commands to create a new database and user:

```bash
-- Create database
$ CREATE DATABASE your_database_name;

-- Create user and grant privileges
$ CREATE USER your_username WITH PASSWORD 'your_password';
$ GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;

```

### Go ahead to clone the repository onto your machine and `cd` into the project



### Preparing the .env File
Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```
Replace your_username, your_password, your_database_name, and your_jwt_secret_key with your actual database username, password, database name, and a secret key for JWT (could be anything) respectively.


### Installing Dependencies
Run the following command to install the necessary dependencies:

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```


### Connecting a web socket client
The project will be using terminal as a client (any termianl should do). So open a new terminal and `cd` into the project. Then run the follwoing commands:

```bash
$ npm install socket.io-client
$ node terminal-client.js
```
You should see a message depicting successful connection as long as the app server is up and running. The opposite is also true.

Actions that publishes events include:
- On Login: All tasks created by the logged in user is publised
- On task creation: updated tasks data is published
- On Task update: updated tasks data is published
- On task delete: updated tasks data is published

Possible Improvements:
- On the websokcet level, clients should be distinguihable based on which user's tasks they want to stream.
- There should also be some kind of validation before a client is added (maybe some sort of required secret key before a client can be added), with this, the user of interest can be ascertained and the related tasks will be published to the clients on connection, removing the need for the user (tasks creator) to be logged in first.


### DATA MODELS, API ENDPOINTS AND POSTMAN COLLECTION
- [Documentation for testing the API](https://docs.google.com/document/d/1ql0IxcfrYx6Ff81SKlp99XpAuzugy7ju4ffF0fVC6-g/edit?usp=sharing)


### Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

