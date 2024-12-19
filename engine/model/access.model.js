const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/connector")
const { User } = require("./user.model")

const Access = sequelize.define(
	"access",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		user_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		path_name: {
			type: DataTypes.STRING,
		},
		path_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type_name: {
			type: DataTypes.STRING,
		},
		type_const: {
			type: DataTypes.ENUM,
			values: ["RESTRICTED", "VIEWER", "EDITOR", "MODIFIER"],
			allowNull: false,
		},
	},
	{
		tableName: "access",
	}
)

User.hasMany(Access, { foreignKey: "user_id", onDelete: "CASCADE" })
Access.belongsTo(User, { foreignKey: "user_id" })

module.exports = { Access }
