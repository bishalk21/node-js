require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const { authAdmin, userAuth } = require("./middlewares/auth");
const testUser = require("./models/user/user");

const app = express();

// test user
app.post("/sign-up", async (req, res, next) => {
  try {
    const userObj = {
      firstName: "Bishal",
      lastName: "Karki",
      email: "karkibishal00@gmail.com",
      password: "123",
      age: 21,
      gender: "male",
    };

    // creating a new instance of testUser model => document
    const user = new testUser(userObj);
    await user.save(); // returns a promise so we use async-await
    res.send("User Created");
  } catch (error) {
    res.status(500).send("Error saving user:" + error.message);
  }
});

app.get("/get-all-users", async (req, res, next) => {
  try {
    const users = await testUser.find();
    res.send(users);
  } catch (error) {
    res.status(500).send("Error fetching users:" + error.message);
  }
});

// error handling middleware
app.get("/getAllUsers", (req, res, next) => {
  // logic of db query and fetching users
  // if error occurs: may be db connection error, query error, wrong js code, etc
  //   throw new Error("Error in fetching users"); // not a good practice to throw error like this
  // use try-catch block
  try {
    // logic of db query and fetching users
    throw new Error("Error in fetching users"); // not a good practice to throw error like this
    res.send("All users are fetched");
  } catch (error) {
    // log the error to know what went wrong
    // console.log(error);
    res.status(500).send("Something error occurred. please contact support");
  }
});

// in global error handling middleware, we can handle all errors
// error must be the first parameter
app.use("/", (err, req, res, next) => {
  if (err) {
    // log the error to know what went wrong
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

// middleware
// middleware auth for all requests GET, POST, DELETE, PUT
app.use("/api/v1/admin", authAdmin);
// app.use("/api/v1/admin", (req, res, next) => {
//   console.log("Admin auth is getting called");
// const token = req.headers?.authorization;
//   const dummyToken = "admin";
//   const isAdminAuthenticated = dummyToken === "admin";
//   if (!isAdminAuthenticated) {
//     res.status(401).send("Unauthorized");
//   } else {
//     next();
//   }
// });

app.get("/api/v1/admin/getAllUsers", (req, res, next) => {
  // const token = req.headers?.authorization;
  //   const dummyToken = "admasdfin";
  //   const isAdminAuthenticated = dummyToken === "admin";
  //   if (isAdminAuthenticated) {
  res.send("all users are fetched");
  //   } else {
  // res.status(401).send("Unauthorized");
  //   }
});

app.get("/api/v1/admin/deleteUser", (req, res, next) => {
  //   const dummyToken = "admin";
  //   const isAdminAuthenticated = dummy === "admin";
  //   if (isAdminAuthenticated) {
  res.send("user is deleted");
  //   } else {
  //     res.status(401).send("Unauthorized");
  //   }
});

app.post("/api/v1/user/login", (req, res, next) => {
  res.send("User Logged In");
});

app.get(
  "/api/v1/user",
  // middleware auth for this route only
  userAuth, // can pass multiple middlewares and since user has only one route, we can pass it directly
  (req, res, next) => {
    res.send({
      id: 1,
      name: "Bishal Karki",
      email: "karkibishal00@gmail.com",
    });
  }
);

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

// connect to db
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Connection error", err);
    // process.exit(1);
  });
