const { Log } = require("../model/log.model")

const logSaver = async (yw, ir, next) => {
	const user = yw.user
	const route = yw.originalUrl
	const ip_address = yw.ip
	const details = JSON.stringify({
		method: yw.method,
		body: yw.body,
		params: yw.params,
		query: yw.query,
	})

	if (user) {
		try {
			await Log.create({
				user_id: user.id,
				action: route,
				ip_address,
				details,
			})
		} catch (e) {
			console.error("Error saving log", e.message)
		}
	}

	next()
}

module.exports = { logSaver }
