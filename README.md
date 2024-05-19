# Task Management System API

## Project Setup
### Prerequisites
Before you begin, ensure you have the following installed on your local machine:

- Node.js
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

# production mode
$ npm run start:prod
```


### DATA MODELS, API ENDPOINTS AND POSTMAN COLLECTION
- [Documentation for testing the API](https://docs.google.com/document/d/1ql0IxcfrYx6Ff81SKlp99XpAuzugy7ju4ffF0fVC6-g/edit?usp=sharing)


### Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

