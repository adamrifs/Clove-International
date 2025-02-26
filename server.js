const express = require('express')
const cors = require('cors')
const connectDB = require('./Config/db')
const userRoutes = require('./Routes/userRoutes')
const investmentRoutes = require('./Routes/investmentRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()


const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: ['https://clove-international.vercel.app', 'http://localhost:3000'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB()

app.use('/api/user', userRoutes)
app.use('/api/investments', investmentRoutes)
app.use('/api/admin', adminRoutes)

app.listen(port, () => {
    console.log(`server connected on port ${port}`)
})