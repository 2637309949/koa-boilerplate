'use strict'

var bcrypt = require('bcryptjs')
const hdl = {}

hdl.checkPasswordCriteria = (password) => {
    const passwordCriteria = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&^*])(?=.{8,})/

    // Test criteria
    let isValid = passwordCriteria.test(password)

    return isValid ? true : false
}


// Hash the user password before saving to the database
hdl.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword
}

// Check if password is correct
hdl.comparePassword = async (password, userPassword) => {
    const isMatch = await bcrypt.compare(password, userPassword)

    return isMatch
}


module.exports = hdl
