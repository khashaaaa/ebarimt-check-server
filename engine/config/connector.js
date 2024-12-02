const mysql = require("mysql2")

const connector = mysql.createConnection({
	user: process.env.MYSQL_USER,
	host: process.env.MYSQL_HOST,
	database: process.env.MYSQL_DATABASE,
	password: process.env.MYSQL_PASSWORD,
})

connector.connect((err) => {
	if (err) {
		console.error("MYSQL connection error: ", err)
	} else {
		console.log("MYSQL connected successfully")
	}
})

module.exports = { connector }
