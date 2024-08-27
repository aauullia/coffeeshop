const adminModel = require('../models/index').admin
const md5 = require('md5')
/** load Operation from Sequelize */
const Op = require('sequelize').Op
exports.addAdmin = (request, response) => {
    /** prepare data from request */
    let newAdmin = {
    name: request.body.name,
    email: request.body.email,
    password: md5(request.body.password),
    }
    /** execute inserting data to admin table */
    adminModel.create(newAdmin)
    .then(result => {
    /** if insert's process success */
    return response.json({
    success: true,
    data: result,
    message: 'New admin has been inserted'
    })
    })
    .catch(error => {
    /** if insert's process fail */
    return response.json({
    success: false,
    message: error.message
    })
    })
    }