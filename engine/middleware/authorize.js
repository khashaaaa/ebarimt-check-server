const { NOT_FOUND, FORBIDDEN } = require("../constant/response")
const { Access } = require("../model/access.model")
const { User } = require("../model/user.model")

const authorize = (type) => {
	return async (yw, ir, next) => {
		try {
			const id = yw.user.id
			const user = await User.findByPk(id, {
				include: {
					model: Access,
					attributes: ["type"],
				},
			})

			if (!user) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			const userAccess = user.access?.type

			if (userAccess === type || userAccess === "MODIFIER") {
				return next()
			}

			return ir
				.status(FORBIDDEN.code)
				.json({ response: FORBIDDEN.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	}
}

module.exports = { authorize }
