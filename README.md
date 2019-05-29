[![Build Status](https://travis-ci.org/hariclerry/population-mgt-sys-api.svg?branch=master)](https://travis-ci.org/hariclerry/population-mgt-sys-api)
[![Coverage Status](https://coveralls.io/repos/github/hariclerry/population-mgt-sys-api/badge.svg?branch=master&service=github)](https://coveralls.io/github/hariclerry/population-mgt-sys-api?branch=master)

# Population Management System

 Population Management System is a system that stores and manages population records based on a particular location, and it is used to record total number of residents in each location broken down by gender.


### FEATURES

With Population Management System you can:
* Create a user account
* Login into the user account
* Add a new location
* view a list of all locations
* Update a location
* View a location
* Delete a location
* Add a new sub location to a location
* view a list of all sub locations belonging to a location
* Update a sub location
* View a sub location
* Delete a sub location

### Requirements
* Node v10.0.0
* Express framework
* MongoDB and Mongoose

### Installation

1. Clone the repository

2. Install dependencies
  ```npm install```

3. Run app
 ```npm start```

4. To build the app
 ```npm run build```

5. Testing

* In order to test the application you can the command
```npm run test``` 

VERSIONS

The API runs with one version, Version 1 

Input `http:127.0.0.1:3000/` followed by any of the following endpoints to demo version 1.

|EndPoint|Functionality|
|---------|------------|
|POST/api/v1/user|Creates a new user account|
|POST/api/v1/user/login|Logs in a user|
|POST/api/v1/location|Creates a new location|
|PUT/api/v1/location/:locationId|Updates a location|
|DELETE/api/v1/busilocationnesses/:locationId|Removes a location|
|GET/api/v1/location|Retrieves all locations|
|GET/api/v1/location/:locationId|Gets a location|
|POST/api/v1/locationId/sub|Creates a new sub location|
|PUT/api/v1/location/:locationId/sub/:id|Updates a location|
|DELETE/api/v1/location/:locationId/sub/:id|Removes a location|
|GET/api/v1/location/:locationId/sub|Retrieves all sub locations|
|GET/api/v1/location/:locationId/sub/:id|Gets a sub location|

### Checkout the live app on heroku
TODO

### API
https://weconnect-harriet5.herokuapp.com/apidocs/

The API is written in Node.Js using the Express framework and mongoDB as the database dialect.

Credits

[Harriet]: https://github.com/hariclerry
