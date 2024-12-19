const { MongoClient } = require("mongodb")
const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: "localhost",
		dialect: "mysql",
		logging: false,
	}
)

const MysqlConnect = async () => {
	try {
		await sequelize.authenticate()
		console.log("Mysql is connected...")
	} catch (err) {
		console.error("Mysql connection error: ", err)
	}
}

let mongo

const MongoConnect = async () => {
	try {
		const mongoURI = process.env.MONGO_URI
		const client = new MongoClient(mongoURI, {
			ssl: false,
		})
		await client.connect()
		console.log("Mongo is connected...")
		mongo = client.db()
	} catch (err) {
		console.error("Mongo connection error: ", err.message)
		process.exit(1)
	}
}

const MongoInit = () => {
	if (!mongo) {
		throw new Error("Mongo initialization error")
	}
	return mongo
}

module.exports = {
	sequelize,
	MysqlConnect,
	MongoConnect,
	MongoInit,
}
