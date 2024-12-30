const { createLogger, format, transports } = require("winston")
const path = require("path")

const logger = createLogger({
	level: "error",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(
			({ timestamp, level, message }) =>
				`${timestamp} [${level.toUpperCase()}]: ${message}`
		)
	),
	transports: [
		new transports.File({
			filename: path.join(__dirname, "../../logs/error.log"),
			level: "error",
		}),
	],
})

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf(({ level, message }) => `${level}: ${message}`)
			),
		})
	)
}

module.exports = { logger }
