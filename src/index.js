const express = require("express");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { StatusCodes } = require("http-status-codes");
const { PORT } = require("./config/index");
const { default: axios } = require("axios");

const setUpServer = async () => {
  const app = express();
  app.use(morgan("combined"));

  const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 5,
  });

  app.use(limiter);
  app.use("/bookingService", async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      console.log(token);
      const response = await axios.post(
        "http://localhost:3001/api/v1/isauthorised",
        {},
        { headers: { Authorization: token } }
      );
      if (response.data.success == "false") {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "unauthorised.Please give a valid token",
        });
      }
      next();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "unauthorised.Please give a valid token",
      });
    }
  });
  app.use(
    "/bookingService",
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(PORT, () => {
    console.log(`${PORT} is running..`);
  });
};

setUpServer();
