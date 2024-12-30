const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
	const header = req.headers.authorization
	if (!header) {
		return res
			.status(401)
			.json({ message: "Token is not provided", success: false })
	}
	const token = header.split(" ")[1]

	if (!token) {
		return res
			.status(401)
			.json({ message: "Token is missing", success: false })
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded
		next()
	} catch (error) {
		return res.status(401).json({ message: error.message, success: false })
	}
}

module.exports = { authenticate }
