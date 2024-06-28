const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((conn) => console.log(`MongoDB connected sussfully`.green.underline))
    .catch((error) => {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    });
};

