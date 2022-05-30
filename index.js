//Imports
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors")({ origin: true });
const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
const authRouter = require("./Routes/Auth");
const imageRouter = require("./Routes/Image");

//Middlewares
app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(authRouter);
app.use(imageRouter);
app.use(express.static('images'))
//DB Connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected !");
  })
  .catch((err) => {
    console.log("Something went wrong!");
    console.log(err);
  });

app.listen(port, host, () => {
  console.log(`App is listning on http://${host}:${port}`);
});


