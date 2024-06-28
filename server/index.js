const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const colors = require("colors");
const database = require('./config/db');

dotenv.config();
const app = express();

app.use(express.json()); 
app.use(cors());


app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('API is running');
});
database.connect();

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`.green.bold)
});

