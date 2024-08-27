const express = require(`express`)
const authController = require(`../controllers/auth.controller`)
const app = express()
app.use(express.json())

app.post('/', authController.authenticate)

module.exports = app