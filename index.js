const express = require('express')
const cors = require('cors')
const path  = require('path')

const authRoute = require('./routes/auth.route')
const adminRoute = require('./routes/admin.route')
const coffeRoute = require('./routes/coffe.route')
const orderRoute = require('./routes/order.route')

const port = 7073
const app = express()

app.use(cors())

app.use('/admin', adminRoute)
app.use('/auth', authRoute)
app.use('/coffe', coffeRoute)
app.use('/order', orderRoute)
app.use(express.static(path.join(__dirname, 'image')));


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})