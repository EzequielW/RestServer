const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const {cloudinaryConfig, uploader} = require('./cloudinaryConfig')
require('dotenv').config({path: __dirname + '/.env.local'})

// Middlewares
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const commentsRoute = require('./routes/comments')
const morgan = require('morgan')

app.use(morgan('combined'));

app.use('*', cloudinaryConfig)
app.use('/posts', postsRoute)
app.use('/users', authRoute)
app.use('/comments', commentsRoute)

// Connection
try {
    const dbConnection = mongoose.connect(process.env.MONGODB_URI, 
        {useNewUrlParser: true, useUnifiedTopology: true}, 
        function() {
            console.log('Connected to database')
    })
}
catch(err){
    console.log(err)
}

app.listen(process.env.PORT || 3000)