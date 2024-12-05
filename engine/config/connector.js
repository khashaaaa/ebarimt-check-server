const { MongoClient } = require("mongodb")

let db

const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGO_URI
		const client = new MongoClient(mongoURI, {
			ssl: false,
		})
		await client.connect()
		console.log("MongoDB connected...")
		db = client.db()
	} catch (err) {
		console.error("Failed to connect to MongoDB:", err)
		process.exit(1)
	}
}

const getDB = () => {
	if (!db) {
		throw new Error("Database not connected")
	}
	return db
}

module.exports = { connectDB, getDB }
