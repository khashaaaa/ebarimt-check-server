/**
 * Application Initialization Script
 * Author: Khashkhuu
 * Description: This script initializes and configures an Express.js application
 * with enhanced security and middleware support. It connects to a MongoDB database
 * and starts the server.
 */

require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const { connectDB } = require("./engine/config/connector")

// Import routers
const { BarimtRouter } = require("./engine/route/barimt.route")
const { OrgRouter } = require("./engine/route/org.route")

// Security and parsing middlewares
app.use(cors())
app.use(helmet())
app.use(xss())
app.use(express.json({ limit: "50mb" }))
app.use(
	express.urlencoded({
		extended: true,
		limit: "50mb",
		parameterLimit: 100000,
	})
)

// Route configurations
app.use("/barimt", BarimtRouter)
app.use("/org", OrgRouter)

// Start server
const startServer = async () => {
	try {
		// Validate required environment variables
		const { PROG_PORT, PROG_HOST } = process.env
		if (!PROG_PORT || !PROG_HOST) {
			throw new Error(
				"Missing required environment variables: PROG_PORT or PROG_HOST"
			)
		}

		// Connect to the database
		await connectDB()
		console.log("MongoDB connected...")

		// Start the server
		app.listen(PROG_PORT, () => {
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
