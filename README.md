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
