const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

var app = express();

/* Database connectivity */
const dburl = "mongodb://127.0.0.1/uid";
mongoose
    .connect(dburl, { useNewUrlParser: true }, (err, db) =>{
        if(err){
            console.log(err);
            console.log("Database Connectivity Error!!");
        } else {
            console.log("Database Connectivity Successfull!");
        }
    });
mongoose.Promise = global.Promise;

/* Middlewares */
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// handling cors errors
app.use(cors());

/* routes */
var routes = require('./routes/routes.js');
app.use('/',routes);

/* Error handling for route which was not defined elsewhere */
app.get('*',(res, req, next) => {
    const error = new Error("Page not found!!");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500).send(error.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}.`);
});
