const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const { default: connectDb } = require('./config/db.js')
const app = express()
// const db = require('./config/db.js')
require('dotenv').config()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api/auth', userRoutes)

const server = app.listen(process.env.PORT, () => {
    connectDb()
    console.log(`Server started on PORT: ${process.env.PORT}`);
})