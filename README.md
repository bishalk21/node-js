# Node.js Project

# Table of Contents

- [How express application works](#how-express-application-works)
- [Middleware](#what-is-middleware)
- [Routing](#what-is-routing)

## About Project

This project is a simple Node.js project that demonstrates how to create a simple Node.js project. The project is a simple REST API that allows users to create, read, update, and delete users. The project uses the Express.js framework to create the REST API.

1. Requirements gathering > between Product Manager and client

- Features
  - Create an account
  - login
  - update profile
  - feed page (explore)
  - send connection request
  - see our matches
  - see requests we have sent and received
  - accept or reject requests
  - chat with connections
  - logout

2. Design > Senior Engineer, Product Manager, and UI/UX Designer

- Architecture

  - Microservices
    - Frontend UI > React.js
    - Backend API > Node.js

- LLD (Low Level Design)

  - Database Schema Design

    - think about the collections and documents needed

      ```
            - users collection
               - \_id
               - name
               - email
               - password
               - profile
                  - bio
                  - image
                  - location
                  - interests

            - connections collection
               - from_user_id
               - to_user_id
               - status
                  - pending
                  - accepted
                  - rejected
                  - blocked
                  - removed
                  - ignored

            - messages collection
               - \_id
               - sender_id
               - receiver_id
               - message
               - timestamp
      ```

- API Endpoints Design - REST API

  - HTTP Methods: to perform CRUD operations

    - POST: Create
    - GET: Read
    - PUT: Update
    - PATCH: Update
    - DELETE: Delete

  - PUT vs PATCH
    - PUT: update all fields
    - PATCH: update one or more fields

  | HTTP Methods | Endpoint                          | Description               |
  | ------------ | --------------------------------- | ------------------------- |
  | POST         | /api/v1/signup                    | Create a new user         |
  | POST         | /api/v1/login                     | Login user                |
  | GET          | /api/v1/users                     | Get all users             |
  | GET          | /api/v1/users/:id                 | Get user by id            |
  | PUT          | /api/v1/users/:id                 | Update user by id         |
  | PATCH        | /api/v1/users/:id                 | Update user by id         |
  | DELETE       | /api/v1/users/:id                 | Delete user by id         |
  | POST         | /api/v1/connections/sendRequest   | Send connection request   |
  | GET          | /api/v1/connections               | Get all connections       |
  | GET          | /api/v1/connections/:id           | Get connection by id      |
  | POST         | /api/v1/connections/reviewRequest | Accept or reject request  |
  | GET          | /api/v1/receivedRequests          | Get all requests received |
  | GET          | /api/v1/sentRequests              | Get all requests sent     |

- UI/UX Design

  - Wireframes
  - Mockups
  - Prototypes

3. Development > Software Engineers

- Frontend Development

  - React.js
  - Redux

- Backend Development
  - Node.js
  - Express.js
  - MongoDB

4. Testing > QA Engineers

- Unit Testing
- Integration Testing

5. Deployment > DevOps Engineers

- CI/CD
- Docker
- Kubernetes

6. Maintenance > DevOps Engineers

- Monitoring
- Logging
- Alerts

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman
- VS Code
- Git & GitHub

### File Structure

```
node-js-project
│
├── backend
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   ├── .env
│   ├── src
│   │   ├── routes
│   │   │   ├── userRoutes.js
│   │   │   ├── connectionRoutes.js
│   │   │   ├── messageRoutes.js
│   │   ├── middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   ├── models
│   │   │   ├── User.js
│   │   │   ├── Connection.js
│   │   │   ├── Message.js
│   │   ├── config
│   │   │   ├── db.js
│   │   ├── helpers
│   │   │   ├── response.js
│   │   │   ├── validation.js
│   │   ├── utils
│   │   │   ├── logger.js
│   │   │   ├── constants.js
│   │   │   ├── error.js
│   │   ├── controllers
│   │   │   ├── userController.js

```

## How express application works

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

> `GET /api/v1/players [request] > express checks all the app.xxx() methods [routes] and middleware functions > request handlers [callback functions] > response [send back to the client]`

- As soon as request comes in (GET /api/v1/players) to express application
  - Express will look for the route handler (METHOD & PATH) that matches the request
  - If it finds the route handler, it will execute the callback function or
  - express will go through the chain of middleware functions until it solves the request
  - If it doesn't find the route handler, it will return 404 Not Found
  - If the route handler is found but the response is not sent, it will hang
  - and will timeout after a certain period
  - If the response is sent, it will not execute the next middleware function

## What is Middleware?

- functions that are executed during the lifecycle of a request to the Express server

> `app.use(middleware)` > `app.use("/path", middleware)` > `app.use("/path", [middleware1, middleware2, middleware3])`

- Suppose in order to update a user in the database by admin, first we need to verify the user is admin or not. So, we can create a middleware function that will check if the user is admin or not. If the user is admin, then only we will allow the user to update the user in the database. Otherwise, we will not allow the user to update the user in the database. This is where middleware functions come into play.

- functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle
- middleware functions can perform the following tasks:

  - execute any code
  - make changes to the request and the response objects
  - end the request-response cycle
  - call the next middleware function in the stack
  - if the current middleware function does not end the request-response cycle,
    it must call next() to pass control to the next middleware function
  - otherwise, the request will be left hanging

- Why do we need Middlewares?

  - code reusability
  - code modularity
  - code maintainability
  - code readability
  - error handling
  - authentication
  - logging
  - parsing
  - compression
  - routing

- `app.listen()`: starts the server and making it listen for incoming requests on the specified port and ip-address(host)

```js
const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

```js
// 1.  express uses Node.js' built-in HTTP module to create an HTTP server.
const http = require("http");
const server = http.createServer(app);
// 2. bind the server to the specified port and ip-address
// 4. pass optional callback function to listen() method
// 5. manages connections, requests, and responses
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
server.listen(port, callback);
// 3. server listens/handles for incoming requests
server.get("/path", handler);
```

[Back to top](#table-of-contents)

## What is Routing?

> `app.httpMethod("/path", callback/handler)`

- process of selecting a path for traffic in a network or between or across multiple networks
- `order in which you define routes is important`
- one route can have multiple route handlers (callback functions) - middleware
  - app.use("/route", rHandler1, rHandler2, rHandler3);
  - app.use("/route", [rHandler1, rHandler2], rHandler3);
  - app.use("/route", [rHandler1, rHandler2, rHandler3]);
  - next(): to pass control to the next middleware function - next() is function in the Express router which, when invoked, - executes the middleware succeeding the current middleware

1. basic level routes

   - app.get(): get request
   - app.post(): post request
   - app.put(): put request
   - app.delete(): delete request

2. advanced level routes

   - app.use(): use middleware - it can handle all types of requests
   - regex: regular expression - pattern matching (app.get(/.fly$/, (req, res, next) => {}))
   - params: app.get("/user/:id", (req, res, next) => {})
   - dynamic routes: app.get("/user/:id", (req, res, next) => {})
   - query params: app.get("/user?userId=101&password=123", (req, res, next) => {})
   - nested routes: app.use("api/v1/players", (req, res, next) => {})

- what if response is not sent?

  - request will be hanging (infinite loop) and will timeout after a certain period
  - if any console.log() is present after res.send(), it will throw an error

## MongoDB

> `app.listen() should be called only after the connection to the database is established`

- install mongoose package: `npm install mongoose`

- a NoSQL database that stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time

> create mongodb database and collection

```js
// 1. create a database
use mydb;

// 2. create a collection
db.createCollection("users");

// 3. insert a document
db.users.insertOne({
  name: "John Doe",
  email: "sgd@"
});

// 4. find all documents
db.users.find();

// 5. find one document
db.users.findOne({ name: "John Doe" });

// 6. update a document
db.users.updateOne({ name: "John Doe" }, { $set: { email: "
" } });

// 7. delete a document
db.users.deleteOne({ name: "John Doe" });
```

- MongoDB Atlas: a cloud database service that provides all of the features of MongoDB without the operational heavy lifting required for any new application

- Mongoose: a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

> connect to mongodb database using mongoose

```js
const mongoose = require("mongoose");

// 1. connect to mongodb database
mongoose
  .connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

// 2. create a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// 3. create a model
const User = mongoose.model("User", userSchema);

// 4. create
const user = new User({
  name: "John Doe",
  email: "
" });

// 5. save
user.save();
```

- Mongoose Schema: a blueprint of the database that defines the shape of the documents within a collection

  - a schema defines the structure of the document, default values, validators, etc.
  - a schema is a class that defines the structure of the documents that you want to store in MongoDB

- Mongoose Model: a constructor compiled from Schema definitions

- Mongoose Document: an instance of a Model

- Mongoose Query: an abstraction that represents a MongoDB query
