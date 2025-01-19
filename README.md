# Blogs backend

Backend for saving blogs by users.

## Description

Backend that supports saving blogs to a MongoDB containerized database. Users have to be logged in to save blogs.
Authentication is through JSON Web Tokens. Please login and set a Bearer authentication header to use the backend.
Has tests that check the main functions.

### Dependencies

* Express
* Express async errors
* Cors
* Mongoose
* Json web token
* BCrypt
* Eslint
* NoDemon
* Sinon
* Supertest

### Installing

* Pull the main branch
* Run 'npm ci' to install the dependencies

### Executing program

#### Running the program
In the project's root folder there is a docker compose file (docker-compose-build.yml) for the database.
Saves the data to the mongo_data folder
```
docker compose -f docker-compose-build.yml up -d
```
Please start the container before running the application
```
npm run dev
```
<br/>
<br/>


#### Running the tests
For the tests it uses another docker compose file that starts a different database that doesn't get saved.
```
docker compose -f docker-compose-test.yml up -d
```
Please start the container before running the tests
```
npm run test
```

## Paths and Methods
    Server running on port 3003
     Login
        POST /api/login - Logins and returns JSON token needed for authentication
        
     Users
        GET /api/users - Return all users
        POST /api/users - Registers/Adds new users
        
     Blogs
        GET /api/blogs - Returns all blogs
        GET /api/blogs/{id} - Returns blog by ID
        POST /api/blogs - Add blog
        POST /api/blogs/{id}/comments - Add a comment to a blog
        PUT /api/blogs/{id} - Update blog
        DELETE /api/blogs/{id} - Delete blog

      Testing
        POST /api/users/testing - Used only when running as testing environment, deletes all Blogs and Users

### Github Workflows
  * Workflow that checks style
  * Workflow that runs tests

## Authors

[Kaloyan Pavlov](https://github.com/KaloyanPavlov4)

## License

This project is licensed under the [MIT] License - see the LICENSE.md file for details
