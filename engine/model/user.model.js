const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/connector")

const User = sequelize.define(
	"user",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		given_name: {
			type: DataTypes.STRING,
		},
		parent_name: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
		},
		phone: {
			type: DataTypes.STRING,
		},
		department: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "user",
	}
)

module.exports = { User }
