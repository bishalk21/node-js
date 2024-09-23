require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const { authAdmin, authAdmins, userAuth } = require("./middlewares/auth");
const testUser = require("./models/user/user");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth/authRouter.js");
const requestConnectionRouter = require("./routers/connections/requestConnectionRouter.js");

const app = express();
// middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());

// auth route handler
app.use("/api/v1/auth", authRouter);
// connection request route handler
app.use("/api/v1/request", requestConnectionRouter);

// test user
// app.post("/sign-up", async (req, res, next) => {
//   try {
//     const userObj = {
//       firstName: "Bishal",
//       lastName: "Karki",
//       email: "karkibishal00@gmail.com",
//       password: "123",
//       age: 21,
//       gender: "male",
//     };

//     // creating a new instance of testUser model
//     const user = new testUser(userObj);
//     await user.save(); // returns a promise so we use async-await
//     res.send("User Created");
//   } catch (error) {
//     res.status(500).send("Error saving user:" + error.message);
//   }
// });

// app.post("/sign-up", async (req, res, next) => {
//   try {
//     // console.log(req); // express responds with object containing request details

//     // encrypting password
//     //  validation of data
//     validateSignUpData(req);

//     // encrypting password
//     const password = req.body.password;
//     const hashedPassword = await hashPassword(password);

//     // console.log(req.body);
//     // if the body is empty, it will return undefined
//     // if the body is in JSON format, it will return the undefined as server cannot read JSON data
//     // to read JSON data, we need to use middleware to parse the JSON data (body-parser or express.json())

//     // saving user
//     const newUser = {
//       ...req.body,
//       password: hashedPassword,
//     };

//     const user = new testUser(newUser);
//     // const user = new testUser(req.body);
//     await user.save();
//     res.send("User Created Successfully");
//   } catch (error) {
//     res.status(500).send("Error saving user:" + error.message);
//   }
// });

// find user by email
app.get("/user", async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const users = await testUser.find({ email: userEmail }); // returns an array of users
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Error fetching user:" + error.message);
  }
});

// get all users - feed api
app.get("/feed", async (req, res, next) => {
  try {
    const users = await testUser.find();
    res.send(users);
  } catch (error) {
    res.status(500).send("Error fetching feed:" + error.message);
  }
});

// find one user by email
app.get("/user", async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const user = await testUser.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching user:" + error.message);
  }
});

// delete user
app.delete("/user", async (req, res, next) => {
  try {
    const userId = req.body.id;
    const user = await testUser.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Error deleting user:" + error.message);
  }
});

// update user
// api level data sanitization
// app.patch("/user", async (req, res, next) => {
// if we want to update the user, we need to pass the id of the user
// we can pass the id in the body or in the params
// if we pass the id in the body, we need to pass the id in the body
// if we pass the id in the params, we need to pass the id in the params
app.patch("/user/:id", async (req, res, next) => {
  try {
    // if we pass the id in the body
    // const userId = req.body.id;

    // if we pass the id in the params
    const userId = req.params?.id;
    const body = req.body;

    // only allow update of certain fields
    const UPDATE_ALLOWED_FIELDS = ["photoUrl", "about", "skills"];

    // check if the fields are allowed to be updated
    const isUpdateAllowed = Object.keys(body).every((field) =>
      UPDATE_ALLOWED_FIELDS.includes(field)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (body?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await testUser.findByIdAndUpdate(userId, body, {
      new: true,
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

// login api
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate email
    if (!email) {
      throw new Error("Email is required");
    } else if (!validator.isEmail(email)) {
      throw new Error("Email is invalid");
    }

    // find user by email
    const user = await testUser.findOne({
      email,
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // compare password
    const isPasswordMatched = await user.validatePassword(password);
    if (!isPasswordMatched) {
      throw new Error("Invalid credentials");
    } else {
      // generate token (JWT)
      // const token = await jwt.sign({ id: user._id }, "mysecretkey");
      const token = await user.createJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.send("User logged in successfully");
    }
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
});

// route only after cookie is set or after login success
app.get("/dashboard", authAdmin, async (req, res, next) => {
  try {
    // get the cookie
    // console.log(req.cookies);
    // check if the cookie is set
    // console.log(cookie);
    // const { token } = req.cookies;

    // if token, ==> valid user and can access the dashboard
    // if no token, ==> invalid user and not authorized
    // if (!token) {
    //   throw new Error("Unauthorized");
    // }

    // if token is present, then user is authorized

    // verify token
    // const decoded = jwt.verify(jwtToken, "mysecretkey");
    // const decoded = await verifyJwtToken(token);

    // console.log(decoded); // decoded token is the payload of the token or the id of the user and iat (issued at) in object format
    // const { id } = decoded;

    // res.send("Dashboard");
    // const user = await testUser.findById(id);
    // if (!user) {
    //   throw new Error("User not found");
    // }

    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching dashboard: " + error.message);
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
    console.log(error);
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
app.use("/api/v1/admin", authAdmins);
// app.use("/api/v1/admin", (req, res, next) => {
// console.log("Admin auth is getting called");
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
    // console.log("Middleware 1");
    // next();
    // res.send("Players Route 1");
    next();
  },
  // error: cannot set headers after they are sent to the client
  // if once response is sent in the route,
  //it cannot be sent again in the same route handler
  (req, res, next) => {
    // console.log("Middleware 2");
    // res.send("Players Route 2");
    next();
  },
  // can have multiple handlers
  (req, res, next) => {
    // console.log("Middleware 3");
    next();
  },
  (req, res, next) => {
    // console.log("Middleware 4");
    // res.send("Players Route 4");
    next();
  },
  (req, res) => {
    // console.log("Middleware 5");
    res.send("Players Route 5");
  },
]);

// another way of calling multiple handlers
app.get("/api/v1/player", (req, res, next) => {
  // console.log("Middleware 1");
  next();
});

app.get("/api/v1/player", (req, res, next) => {
  // console.log("Middleware 2");
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
  // console.log(req.query);
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
