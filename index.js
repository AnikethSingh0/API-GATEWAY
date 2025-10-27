const express = require("express");
const morgan = require("morgan");
const {status} = require('http-status')
const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const setUpServer = async () => {
    app.get('/',(req,res)=>{
        res.status(status.OK).json({
            message:"sucessfully get response"
        })
    })
  app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT} is running..`);
  });
};

setUpServer();
