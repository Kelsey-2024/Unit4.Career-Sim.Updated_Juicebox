const express = require("express");
const morgan = require("morgan");
const app = express();
const jwt = require("jsonwebtoken");

//middleware (incl. body parser & static file-serving)
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//authentication
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  }catch {
    req.user = null;
  }
  next();
});

//Routes to files in auth + api folder
app.use("/auth", require("./auth"));
app.use("/api", require("./api")); //uncomment once file is created

//Errors for middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.use((req, res) => {
  res.status(404).send("Not found.");
})

module.exports = app;