const express = require("express");

const app = express();

// app.method('path', callback/handler)

/** How express application works
 *
 * GET /api/v1/players [request] > express checks all the app.xxx() methods [routes] and middleware functions
 * > request handlers [callback functions] > response [send back to the client]
 *
 * ASAP request comes in (GET /api/v1/players) to express application
 * Express will look for the route handler (METHOD & PATH) that matches the request
 * If it finds the route handler, it will execute the callback function or
 * express will go through the chain of middleware functions until it solves the request
 * If it doesn't find the route handler, it will return 404 Not Found
 * If the route handler is found but the response is not sent, it will hang
 * and will timeout after a certain period
 * If the response is sent, it will not execute the next middleware function
 */

/** What is Middlewares?
 * - functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle
 * - middleware functions can perform the following tasks:
 *      - execute any code
 *      - make changes to the request and the response objects
 *      - end the request-response cycle
 *      - call the next middleware function in the stack
 *      - if the current middleware function does not end the request-response cycle,
 *       it must call next() to pass control to the next middleware function
 *      - otherwise, the request will be left hanging
 *
 * Why do we need Middlewares?
 * - code reusability
 * - code modularity
 * - code maintainability
 * - code readability
 * - error handling
 * - authentication
 * - logging
 * - parsing
 * - compression
 * - routing
 */

/** routing: process of selecting a path for traffic in a network or between or across multiple networks
 *
 * - order in which you define routes is important
 * - one route can have multiple route handlers (callback functions) - middleware
 *   - next(): to pass control to the next middleware function
 *            - next() is function in the Express router which, when invoked,
 *            - executes the middleware succeeding the current middleware
 *
 * 1. basic level routes
 *    - app.get(): get request
 *    - app.post(): post request
 *    - app.put(): put request
 *    - app.delete(): delete request
 *
 * 2. advanced level routes
 *   - app.use(): use middleware - it can handle all types of requests
 *   - regex: regular expression - pattern matching (app.get(/.*fly$/, (req, res, next) => {}))
 *   - params: app.get("/user/:id", (req, res, next) => {})
 *   - dynamic routes: app.get("/user/:id", (req, res, next) => {})
 *   - query params: app.get("/user?userId=101&password=123", (req, res, next) => {})
 *   - nested routes: app.use("api/v1/players", (req, res, next) => {})
 *
 * what if response is not sent?
 * - request will be hanging (infinite loop) and will timeout after a certain period
 * - if any console.log() is present after res.send(), it will throw an error
 */

// one route can have multiple route handlers (callback functions) - middleware
// app.use("/route", rHandler1, rHandler2, rHandler3);
// app.use("/route", [rHandler1, rHandler2], rHandler3);
// app.use("/route", [rHandler1, rHandler2, rHandler3]);

app.use("/api/v1/players", [
  (req, res, next) => {
    console.log("Middleware 1");
    // next();
    // res.send("Players Route 1");
    next();
  },
  // error: cannot set headers after they are sent to the client
  // if once response is sent in the route,
  //it cannot be sent again in the same route handler
  (req, res, next) => {
    console.log("Middleware 2");
    // res.send("Players Route 2");
    next();
  },
  // can have multiple handlers
  (req, res, next) => {
    console.log("Middleware 3");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 4");
    // res.send("Players Route 4");
    next();
  },
  (req, res) => {
    console.log("Middleware 5");
    res.send("Players Route 5");
  },
]);

// another way of calling multiple handlers
app.get("/api/v1/player", (req, res, next) => {
  console.log("Middleware 1");
  next();
});

app.get("/api/v1/player", (req, res, next) => {
  console.log("Middleware 2");
  next();
});

// advanced level routes
app.use("/ab?c", (req, res, next) => {
  res.send("ab?c Route");
});

// regex
app.use(/a/, (req, res, next) => {
  res.send("Regex Route");
});

app.get(/.*fly$/, (req, res, next) => {
  // ends with fly
  res.send("Regex Route");
});

// params
app.get("/user?userId=101&password=123", (req, res, next) => {
  console.log(req.query);
});

// dynamic routes
app.get("/user/:id", (req, res, next) => {
  res.send(req.params.id);
});

// basic level routes
app.get("/api/v1/user", (req, res, next) => {
  res.send({
    id: 1,
    name: "Bishal Karki",
    email: "karkibishal00@gmail.com",
  });
});

app.post("/api/v1/user", (req, res, next) => {
  const user = {
    id: 1,
    name: "Bishal Karki",
    email: "karkibishal00@gmail.com",
  };
  res.send({
    message: "User Created",
    user,
  });
});

app.delete("/api/v1/user/1", (req, res, next) => {
  res.send("User Deleted");
});

app.use("api/v1/players", (req, res, next) => {
  res.send("Players Route");
});

app.use("/", (req, res, next) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
