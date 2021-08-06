const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
require('dotenv/config')

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const commentsRoute = require('./routes/comments')

app.use('/images', express.static(__dirname + '/imageUpload'))
app.use('/posts', postsRoute)
app.use('/users', authRoute)
app.use('/comments', commentsRoute)

// Connection
try {
    const dbConnection = mongoose.connect(process.env.DB_CONNECTION, 
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        function() {
            console.log('Connected to database')
    })
}
catch(err){
    console.log(err)
}

app.listen(3000)