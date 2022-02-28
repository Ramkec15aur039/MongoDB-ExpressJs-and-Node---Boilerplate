/*
   Name : app.js
*/

/** ***************** Models Import ******************************************************** */
const express = require("express");
const path = require("path");
const expressip = require("express-ip");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middleware/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middleware/error");
const ApiError = require("./utils/ApiError");
const { defaultTestData } = require("./services/user.service");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
// app.set(process.env.PORT || 3000)
// set security HTTP headers
app.use(helmet());
app.use(cookieParser());
// parse json request body
app.use(express.json({ limit: "500mb" }));
// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

app.use(expressip().getIpInfoMiddleware); // to get ip of the client
// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
app.use(passport.session());

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}
// v1 api routes
app.use("/v1", routes);
// send back a 404 error for any unknown api request
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// add test data when it is not in production
if (config.env !== "production") {
  defaultTestData().then((res) => console.log(res));
}
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
module.exports = app;
