const bcrypt = require("bcrypt")

const salt = 10

const hashPassword = async (pass) => {
	try {
		const hashed = await bcrypt.hash(pass, salt)
		return hashed
	} catch (err) {
		console.error("Error hash password: ", err)
		throw err
	}
}

module.exports = { hashPassword }
