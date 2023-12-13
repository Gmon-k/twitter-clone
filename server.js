const express = require('express');
const userApi = require('./Backend/API/user.server');
const tweetApi =require('./Backend/API/tweet.server');
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser')


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', userApi);
app.use('/api/tweet',tweetApi)

const MONGO_CONNECTION_STRING = 'mongodb+srv://gmon:gmonk@cluster0.rdeco0w.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

let frontend_dir = path.join(__dirname, 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});


app.listen(process.env.PORT || 3500, function() {
    console.log("Starting server now...")
})

