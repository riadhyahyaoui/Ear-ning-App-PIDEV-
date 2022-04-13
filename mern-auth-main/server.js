require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')

const app = express();

//!middlewares

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//!Routers
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/user', require('./routes/userRouter'));
app.use('/api/admin', require('./routes/authAdminRouter'));

app.use('/api/music', require('./routes/music/musicRouter'));


app.use('/api/reclamation', require('./routes/reclamation/reclamationRouter'));
app.use('/api/reclamationAdmin', require('./routes/reclamation/reclamationAdminRouter'));

var configDB = require('./database/mongodb.json');

//!Database connection to mongoose

//mongo config 
const connect = mongoose.connect(

  configDB.mongo.uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    findOneAndUpdate: true
  },
  () => console.log('Connected to DB !!'));

//!listening on port

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on ", port);
});