const { hashPassword } = require("../middleware/crypt")
const { CREATED, SUCCESS } = require("../constant/response")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require("../model/user.model")
const { Access } = require("../model/access.model")

module.exports = {
	login: async (yw, ir) => {
		try {
			const { email, password } = yw.body

			const user = await User.findOne({ where: { email } })

			if (!user) {
				return ir
					.status(401)
					.json({ response: "Хэрэглэгч олдсонгүй.", success: false })
			}

			const validPassword = await bcrypt.compare(password, user.password)

			if (!validPassword) {
				return ir
					.status(401)
					.json({ message: "Нууц үг буруу байна.", success: false })
			}

			const access = await Access.findAll({ where: { user_id: user.id } })

			const token = jwt.sign(
				{
					user: user,
					access: access,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: "2h",
				}
			)

			ir.status(200).json({
				message: "Амжилттай нэвтэрлээ",
				success: true,
				token,
			})
		} catch (error) {
			ir.status(500).json({ response: error.message, success: false })
		}
	},

	createUser: async (yw, ir) => {
		try {
			const {
				given_name,
				parent_name,
				email,
				phone,
				department,
				password,
				user_type,
			} = yw.body

			const hashed = await hashPassword(password)

			await User.create({
				given_name,
				parent_name,
				email,
				phone,
				department,
				password: hashed,
				user_type,
			})

			return ir.status(CREATED.code).json({ response: CREATED.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	showUsers: async (yw, ir) => {
		try {
			const users = await User.findAll()

			return ir.status(200).json({ response: users })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	editUser: async (yw, ir) => {
		try {
			const {
				id,
				given_name,
				parent_name,
				email,
				phone,
				department,
				password,
			} = yw.body

			const hashed = hashPassword(password)

			await User.update(
				{
					given_name,
					parent_name,
					email,
					phone,
					department,
					password: hashed,
				},
				{ where: id }
			)

			return ir.status(SUCCESS.code).json({ response: SUCCESS.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	deleteUser: async (yw, ir) => {
		try {
			const { id } = yw.params

			await User.destroy({ where: { id } })

			return ir.status(SUCCESS.code).json({ response: SUCCESS.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},
}
