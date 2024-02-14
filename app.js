require('dotenv').config()
require('express-async-errors')
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
//Product routes import
const products = require('./routes/products')

//Express server creation. Port assign.
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
//DB Connection import
const connectDB = require('./db/connect')
app.use(express.json())

//'/'Route handler.
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>')
})
//Use products routes. Set base url and pass products routes.
app.use('/api/v1/products', products);

//Not found and error handlers.
app.use(notFoundMiddleware)
app.use(errorMiddleware)

//Start app. Connect DB. Set listening port and run server.
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`server is listening by port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

//Run server.
start();