/**
 * Application Initialization Script
 * Author: Khashkhuu
 * Description: This script initializes and configures an Express.js application
 * with enhanced security and middleware support. It connects to a MongoDB database
 * and starts the server.
 */

require("dotenv").config()
const express = require("express")
const prog = express()
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")

const { MysqlConnect } = require("./engine/config/connector")
const { MongoConnect } = require("./engine/config/connector")

const { BarimtRouter } = require("./engine/route/barimt.route")
const { OrgRouter } = require("./engine/route/org.route")
const { UserRouter } = require("./engine/route/user.route")
const { AccessRouter } = require("./engine/route/access.route")

const { Access } = require("./engine/model/access.model")
const { User } = require("./engine/model/user.model")

prog.use(cors())
prog.use(helmet())
prog.use(xss())
prog.use(express.json({ limit: "50mb" }))
prog.use(
	express.urlencoded({
		extended: true,
		limit: "50mb",
		parameterLimit: 100000,
	})
)

prog.use("/barimt", BarimtRouter)
prog.use("/org", OrgRouter)
prog.use("/user", UserRouter)
prog.use("/access", AccessRouter)

const startServer = async () => {
	try {
		const { PROG_PORT, PROG_HOST } = process.env
		if (!PROG_PORT || !PROG_HOST) {
			throw new Error(
				"Missing required environment variables: PROG_PORT or PROG_HOST"
			)
		}

		await MysqlConnect()

		const mode = {
			force: false,
			alter: false,
		}

		await User.sync(mode)
		await Access.sync(mode)
		console.log("Mysql tables synced...")

		await MongoConnect()

		prog.listen(PROG_PORT, () => {
			console.log(
				`Application started on http://${PROG_HOST}:${PROG_PORT}`
			)
		})
	} catch (error) {
		console.error("Server startup failed:", error.message)
		process.exit(1)
	}
}

startServer()
