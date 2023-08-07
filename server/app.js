const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();


const app = express();
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', "Refresh-Token"],
}));

// importing the routes
const loginRoutes = require('./routes/adminRoutes/registrationAndLoginRoutes');
const userCreationRoutes = require('./routes/userCreation/createUserRoutes');
const userDataRoutes = require("./routes/userDataRoutes/usersData");
const connectorRoutes = require("./routes/connectorRoutes/connectorRoutes");
const reportRoutes = require("./routes/reportRoutes/reportRoutes");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json('application/json'));
app.all('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization', "Refresh-Token");
    next();
});


app.use(loginRoutes);
app.use(userCreationRoutes);
app.use(userDataRoutes);
app.use(connectorRoutes);
app.use(reportRoutes);

mongoose
    .connect("mongodb://localhost:27017/convz", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        app.listen(3300);
    })
    .catch(error => {
        console.log("Database connection error");
        process.exit(1);
    })