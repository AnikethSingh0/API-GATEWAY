const express = require("express");
const morgan = require("morgan");
const { StatusCodes } = require("http-status-codes");
const { PORT } = require("./config/index");

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/bookingService",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  })
);

const setUpServer = async () => {
  app.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({
      message: "sucessfully get response",
    });
    console.log(req.body);
  });
  app.listen(PORT, () => {
    console.log(`${PORT} is running..`);
  });
};

setUpServer();
