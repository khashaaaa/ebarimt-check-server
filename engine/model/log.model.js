const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/connector")

const Log = sequelize.define(
	"log",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		action: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ip_address: {
			type: DataTypes.STRING,
		},
		timestamp: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		details: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "log",
		timestamps: false,
	}
)

module.exports = { Log }
