# Node.js Project

- overall
  - create a server using express.js
  - create routes for different endpoints
  - create a database using MongoDB and connect to the database
  - create a schema and model for the database
  - create APIs to perform CRUD operations
  - create a middleware for authentication, error handling, etc.
  - data input sanitization and validation
  - encrypting passwords before storing in the database

> server + mongodb > middlewares > routes [request handlers + API level - validation + sanitization + encryption] > controllers > models [db level - validation + sanitization] > database > response

# Table of Contents

- [How express application works](#how-express-application-works)
- [Middleware](#what-is-middleware)
- [Routing](#what-is-routing)
- [MongoDB](#mongodb)
  - [Mongoose](#mongoose)
  - [Data Input Sanitization and Validation](#data-input-sanitization-and-validation)
  - [schemaTypes in Mongoose](#schematypes-in-mongoose)
  - [Fields in MongoDB](#fields-in-mongodb)
  - [\_\_id field and \_\_v field in MongoDB](#_id-field-and-__v-field-in-mongodb)
- [Encrypting Passwords](#encrypting-passwords)
- [Authentication](#authentication)
  - [TCP/IP Connection](#tcpip-connection)
  - [Cookies in Express](#cookies-in-express)

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

7. Support > Customer Support

- Ticketing System
- Chat Support

8. Marketing > Marketing Team

- SEO
- SEM
- SMM

9. Sales > Sales Team

- CRM
- Sales Funnel

10. Feedback > Product Manager

- Feedback from users
- Feedback from stakeholders

11. Updates > Software Engineers

- New Features
- Bug Fixes

12. Retirement > Software Engineers

- End of Life

[Back to top](#table-of-contents)

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

[Back to top](#table-of-contents)

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

- Request > Middleware > Route Handler > Response

> NEVER trust request.body, request.query, request.params

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

## Middlewares in Express

- built-in middleware

  - express.json(): parses incoming requests with JSON payloads

    - reads the json payload object from the request body
    - parses the json payload object into a javascript object
    - req.body: contains key-value pairs of data submitted in the request body

      ```js
      app.use(express.json());
      ```

  - express.urlencoded(): parses incoming requests with URL-encoded payloads
  - express.static(): serves static files

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

### Mongoose:

    - a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
    - popular ODM (Object Data Modeling) library for MongoDB and Node.js

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

[Back to top](#table-of-contents)

## Data Input Sanitization and Validation

- mostly data input happens through the user interface (UI) in the form of forms, fields, etc, which is in the post request body and in server side, we need to validate and sanitize the data before storing it in the database

- Data Input Sanitization: the process of cleaning and validating user input to prevent security vulnerabilities

  - prevent SQL Injection
  - prevent NoSQL Injection
  - prevent Cross-Site Scripting (XSS)
  - prevent Cross-Site Request Forgery (CSRF)
  - prevent Command Injection
  - prevent Path Traversal
  - prevent Code Injection
  - prevent LDAP Injection
  - prevent XML Injection
  - prevent Sensitive Data Exposure
  - prevent Broken Authentication
  - prevent Broken Access Control
  - prevent Insecure Deserialization
  - prevent Security Misconfiguration
  - prevent Insufficient Logging & Monitoring
  - prevent Insecure Direct Object References
  - prevent Unvalidated Redirects & Forwards

- Data Input Validation: the process of ensuring that the data provided by the user meets the requirements of the application

  - prevent invalid data from being stored in the database
  - prevent invalid data from being processed by the application
  - prevent invalid data from being displayed to the user
  - prevent invalid data from being sent to other systems

### schemaTypes in Mongoose

- String: for strings
- Number: for numbers
- Date: for dates
- Buffer: for binary data
- Boolean: for true/false values
- Mixed: for mixed types
- ObjectId: for object IDs
- Array: for arrays

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,

  // nested schema
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },

  // array of strings
  hobbies: [String],

  // array of objects
  friends: [
    {
      name: String,
      email: String,
    },
  ],
});
```

- SchemaType Options

  - required: boolean or function, if true, the value is required
  - default: any, sets a default value for the path
  - select: boolean, specifies default projections for queries
  - validate: function, adds a validator function for this property
    - in update operations, runValidators: true must be passed to explicitly run validators
  - get: function, defines a custom getter for this property
  - set: function, defines a custom setter for this property
  - alias: string, defines a virtual with the given name that gets/sets this path

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
  },
```

- unique: boolean, if true, the value must be unique across the collection
- min: number, specifies the minimum value for the path
- max: number, specifies the maximum value for the path
- enum: array, specifies the allowed values for the path
- match: RegExp, specifies a regular expression that the string must match
- lowercase: boolean, if true, the string will be converted to lowercase
- uppercase: boolean, if true, the string will be converted to uppercase
- trim: boolean, if true, the string will be trimmed

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
  },
});
```

- validate: function, adds a validator function for this property
  - in update operations, runValidators: true must be passed to explicitly run validators

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return v.length > 2;
      },
      message: "Name must be at least 3 characters",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: "Email must be a valid email address",
    },
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
  },
});
```

```js
// run validators
await user.save({ runValidators: true });
```

### Fields in MongoDB

### \_id field and \_\_v field in MongoDB

```json
{
  "_id": "66ebf90f801b46af77fc68ab", // ObjectId generated by MongoDB
  "firstName": "Bishal",
  "lastName": "Karki",
  "email": "karkibishal00@gmail.com",
  "password": "123",
  "age": 21,
  "gender": "male",
  "__v": 0 // Version key generated by Mongoose
}
```

1. \_id field

   - a unique identifier for the document
   - MongoDB automatically adds a unique \_id as an ObjectId field to each document if you do not provide one when you create the document
   - acts as a primary key for the document
   - efficient indexing, querying, and sorting, and accessing each record in the collection

   - ObjectId: a 12-byte unique identifier for documents in a collection
     - 4 bytes: timestamp (when the ObjectId or document was created)
     - 5 bytes: random value (to make the ObjectId unique)
     - 3 bytes: incrementing counter (to ensure uniqueness in the same second)

2. \_\_v field

   - a version key that is used by Mongoose for internal versioning of documents
   - tracks the version of the document for optimistic concurrency control when when multiple updates are happening on the same document at the same time, Mongoose can detect conflicts and prevent unintended overwrites.
   - mongoose adds automatically starting from 0 when a new document is created and increments by 1 every time the document is updated
   - helpful for complex operations where different processes might be updating the same document at the same time

[Back to top](#table-of-contents)

## API level validation

- Problems with schema level validation
  - fields like emailId changes if updated
- whatever we pass in the request body, its accepted by the schema level validation

> add validation to the every field in the request body

```js
// 1. add validation to the every field in the request body
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: "Email must be a valid email address",
    },
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
  },
});
```

- validator for email validation `npm i validator`

```js
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: "Email must be a valid email address",
    },
  },
});
```

[Back to top](#table-of-contents)

### Encrypting Passwords

- never store passwords in plain text in the database
- always hash the passwords before storing them in the database
- use a strong hashing algorithm like bcrypt to hash the passwords
- bcrypt: a password-hashing function designed to be slow and computationally intensive to protect against brute force attacks

> encrypting passwords before storing in the database

```js
const bcrypt = require("bcrypt");

// 1. hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash("123", salt);

// 2. compare the password
const isValid = await bcrypt.compare("123", hashedPassword);
```

- bcrypt.genSalt(): generates a salt for the hash
- bcrypt.hash(): generates a hash for the password
- bcrypt.compare(): compares the password with the hash

[Back to top](#table-of-contents)

## Authentication

- the process of verifying the identity of a user

> user signs in
> server verifies the user's credentials (validates the email and password)
> server hashes the password and compares it with the hashed password stored in the database
> server creates a token (JWT) and signs the token with a secret key
> server adds the token to the cookie

- Types of Authentication

  - Basic Authentication: username and password
  - Token-based Authentication: JWT (JSON Web Tokens)
  - OAuth: Open Authorization
  - OAuth2: Open Authorization 2.0
  - SAML: Security Assertion Markup Language
  - OpenID: OpenID Connect
  - LDAP: Lightweight Directory Access Protocol
  - SSO: Single Sign-On
  - MFA: Multi-Factor Authentication

- when user is making a request to the server, TCP/IP connection is established between the client and the server and the server needs to verify the user is authenticated or not before processing the request.

### TCP/IP Connection

- during the TCP/IP connection, the client and the server exchange packets of data over the network

  - once the client sends a request to the server, the server re eives the request and processes it or sends a response(data) back to the client and closes the connection. this is repeated for every request made by the client. this is how the client and the server communicate with each other over the tcp/ip connection.

- Transmission Control Protocol (TCP): a connection-oriented protocol that provides reliable, ordered, and error-checked delivery of a stream of bytes between applications running on hosts communicating over an IP network

- Internet Protocol (IP): a network-layer protocol that provides the routing and addressing of packets between hosts

- TCP/IP Connection Establishment

  - 3-way handshake: a method used in a TCP/IP network to create a connection between a local host/client and a server

    - SYN: the client sends a SYN packet to the server to initiate a connection
    - SYN-ACK: the server responds with a SYN-ACK packet to acknowledge the request
    - ACK: the client sends an ACK packet to acknowledge the response

  - 4-way handshake: a method used in a TCP/IP network to terminate a connection between a local host/client and a server

    - FIN: the client sends a FIN packet to the server to close the connection
    - ACK: the server responds with an ACK packet to acknowledge the request
    - FIN: the server sends a FIN packet to the client to close the connection
    - ACK: the client responds with an ACK packet to acknowledge the request

- TCP/IP Connection Termination

  - 4-way handshake: a method used in a TCP/IP network to terminate a connection between a local host/client and a server

    - FIN: the client sends a FIN packet to the server to close the connection
    - ACK: the server responds with an ACK packet to acknowledge the request
    - FIN: the server sends a FIN packet to the client to close the connection
    - ACK: the client responds with an ACK packet to acknowledge the request

  - what happens when a client requests a login request?

    - the client sends a login request (email and password) to the server
    - the server receives the login request and verifies the user's credentials (validates the email and password)
    - server creates a token (JWT), and wrap token inside a cookie,

      - server can set the expiration time for the token (1 hour, 1 day, 1 week, etc.)

    - server signs the token with a secret key, and sends the cookie back to the client in response
    - browser stores the cookie in its storage
    - client sends the token in the header of every request to the server, and server verifies the token with the secret key and allows the user to access the protected routes

- what if client request with expired token?

  - server sends a response with status code 401 (Unauthorized) and client needs to login again to get a new token

### Cookies in Express

> need cookie-parser package for handling cookies in express: `npm install cookie-parser`

    - cookies are in the form of key-value pairs or objects that are stored in the client's browser
    - to parse the cookies in express, we need to use the cookie-parser middleware

    ```js
    const cookieParser = require("cookie-parser");
    app.use(cookieParser());

    app.get("/", (req, res) => {
      // read a cookie
      const token = req.cookies.token;
      console.log(token); // token value
      res.send("Hello World");
    });
    ```

    - if no cookie is available, then req.cookies will be an empty object: `[Object: null prototype] {}`

> the browser receives the cookie and stores it in its storage, and sends the cookie in the header of every request to the server

- a small piece of data stored in the client's browser that is sent to the server with every request
- used to store user information, session data, and other data that needs to be persisted across requests

> create a cookie in express

```js
// 1. create a cookie
// res.cookie(name, value, options)
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 3600000,
});
```

- httpOnly: boolean, if true, the cookie is only accessible from the server and not from the client-side JavaScript
- secure: boolean, if true, the cookie is only sent over HTTPS
- sameSite: string, specifies the SameSite attribute of the cookie
- maxAge: number, specifies the maximum age of the cookie in milliseconds

> read a cookie in express

```js
// 2. read a cookie
// req.cookies
const token = req.cookies.token;
```

- req.cookies: an object that contains all the cookies sent by the client in the request

> delete a cookie in express

```js
// 3. delete a cookie
// res.clearCookie(name, options)
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
```

- res.clearCookie(): deletes a cookie by name

[Back to top](#table-of-contents)

### JWT (JSON Web Tokens)

- jwt and express

  > jwt.sign(payload, secret-key, options) ==> token
  > res.cookie("token", token, options) ==> cookie
  > req.cookies.token ==> token
  > jwt.verify(token, secret-key) ==> payload or decoded ==> {id, iat}
  > payload ==> {id, iat}
  > user ==> find user by id
  > allow user to access the protected routes
  > token only allows the user to access the protected routes that are authorized

- a compact, URL-safe means of representing claims to be transferred between two parties
- a token that is used to authenticate users and authorize access to protected routes

> create a token in express

```js
const jwt = require("jsonwebtoken");

// 1. create a token
// jwt.sign(payload, secret-key, options)
// jwt.sign(payload/id:hidden, secret-key: which no one knows except the server, options: expiresIn)
const token = jwt.sign({ _id: user._id }, "secret-key or private-key");
```

- jwt.sign(): generates a token
- jwt.verify(): verifies a token

> verify a token in express

```js
// 2. verify a token
const decoded = jwt.verify(token, "secret-key");
```

- jwt.verify(): verifies a token and returns the decoded payload
- secret-key: a secret key that is used to sign the token\
- expiresIn: a time in seconds or a string describing a time span (e.g., 60, "2 days", "10h", "7d")

- JWT Structure

  - Header: contains the type of the token and the signing algorithm (red)
  - Payload: contains the claims (data) that are being transferred (purple)
  - Signature: contains the encoded header, the encoded payload, the secret key, and the signing algorithm (blue)

  ```json
  // JWT Structure
  {
    "header": {
      "alg": "HS256",
      "typ": "JWT"
    },
    "payload": {
      "sub": "1234567890",
      "name": "John Doe",
      "admin": true
    },
    "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
  }
  ```

- JWT Claims

  - iss: issuer
  - sub: subject
  - aud: audience
  - exp: expiration time
  - nbf: not before
  - iat: issued at
  - jti: JWT ID

- JWT Algorithms

  - HS256: HMAC with SHA-256
  - HS384: HMAC with SHA-384
  - HS512: HMAC with SHA-512
  - RS256: RSA with SHA-256
  - RS384: RSA with SHA-384
  - RS512: RSA with SHA-512
  - ES256: ECDSA with SHA-256
  - ES384: ECDSA with SHA-384
  - ES512: ECDSA with SHA-512

- JWT Best Practices

  - always use HTTPS
  - never store sensitive information in the payload
  - always validate the token
  - always use strong secret keys
  - always set the expiration time
  - always use the latest version of the library

[Back to top](#table-of-contents)
