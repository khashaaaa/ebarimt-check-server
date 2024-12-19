const { CREATED, SUCCESS } = require("../constant/response")
const { Access } = require("../model/access.model")

module.exports = {
	createAccessType: async (yw, ir) => {
		try {
			const {
				user_id,
				user_name,
				path_url,
				path_name,
				type_const,
				type_name,
			} = yw.body

			await Access.create({
				user_id,
				user_name,
				path_url,
				path_name,
				type_const,
				type_name,
			})

			return ir.status(CREATED.code).json({ response: CREATED.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	showAllAccess: async (yw, ir) => {
		try {
			const accesses = await Access.findAll()

			return ir.status(200).json({ response: accesses })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	editAccessType: async (yw, ir) => {
		try {
			const {
				id,
				user_id,
				user_name,
				path_url,
				path_name,
				type_const,
				type_name,
			} = yw.body

			await Access.update(
				{
					user_id,
					user_name,
					path_url,
					path_name,
					type_const,
					type_name,
				},
				{ where: { id } }
			)

			return ir.status(SUCCESS.code).json({ response: SUCCESS.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	deleteAccessType: async (yw, ir) => {
		try {
			const { id } = yw.params

			await Access.destroy({ where: { id } })

			return ir.status(SUCCESS.code).json({ response: SUCCESS.message })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},
}
