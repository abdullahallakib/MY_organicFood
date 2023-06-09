const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const { head } = require("./routers/toursRouter");
const ratelimit = require("express-rate-limit");
const AppError = require("./utilits/appError");
const globalErrorHandler = require("./controllers/ErrorControl");
const toursRouter = require("./routers/toursRouter");
const orderRouter = require("./routers/orderRouter");
const FoodRouter = require("./routers/FoodRouter");
const usersRouter = require("./routers/usersRouter");
const reviewRouter = require("./routers/reviewRouter");
const bookingRouter = require("./routers/bookingsRouter");
const viewRoter = require("./routers/viewRoutes");
const helmet = require("helmet");
const mongosanitze = require("express-mongo-sanitize");
const xss_clean = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const app = express();
const compression = require("compression");
const { default: mongoose } = require("mongoose");

// start express app
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  massage: "Too many requests from this IP,please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongosanitze());
app.use(xss_clean());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

const date = new Date().toString();
// console.log(date);
app.use((req, res, next) => {
  req.requestTime = date;

  next();
});

app.use("/", viewRoter);

app.use("/api/v1/recipe", toursRouter);
app.use("/api/v1/Food", FoodRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
