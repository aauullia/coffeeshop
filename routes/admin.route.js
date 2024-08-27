/** load library express */
const express = require('express')
/** initiate object that instance of express */
const app = express()
/** allow to read 'request' with json type */
app.use(express.json())
/** load user's controller */
const adminController =
require('../controllers/admin.controller')
/** create route to get data with method "GET" */
app.post("/", adminController.addAdmin)
/** export app in order to load in another file */
module.exports = app