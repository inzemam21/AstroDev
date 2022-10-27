const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const path = require('path')
const fileupload = require('express-fileupload')
const helmet = require("helmet");
const xss = require("xss-clean");
const ratelimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db')
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const errorHandler = require('./middleware/errorMiddleware')

dotenv.config({path: './config/config.env'})

connectDB()
const app = express()

app.use(express.json())
app.use(cookieParser())
//Dev loggin Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(fileupload())

//sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//prevent cross site scripting
app.use(xss());

//rate limiting
const limiter = ratelimit.rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Mins
    max: 100
})

app.use(limiter)

//prevent http param pollution
app.use(hpp());

//enable cors
app.use(cors());

//Set static 
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)


const PORT = process.env.PORT || 8080

const server = app.listen(PORT, console.log(`Server running in 
${process.env.NODE_ENV} mode on port ${PORT}`.magenta.bold))

// handle unhandled rejections
process.on('unhandledRejection', (err, router) => {
    console.log(`Error ${err.message}`)
    server.close(() => process.exit(1))
})