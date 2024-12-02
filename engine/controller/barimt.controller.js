const util = require("util")
const { connector } = require("../config/connector")
const query = util.promisify(connector.query).bind(connector)

module.exports = {
	findBarimt: async (yw, ir) => {
		try {
			const { id, date } = yw.body

			if (!id || !date) {
				return ir.status(400).json({ response: "Мэдээлэл дутуу байна" })
			}

			const results = await query(
				"SELECT * FROM ebarimt.barimt WHERE id = ? AND date = ?",
				[id, date]
			)

			if (results.length === 0) {
				return ir.status(404).json({ response: "Мэдээлэл олдсонгүй" })
			}

			return ir.status(200).json({ response: results })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	deleteBarimt: async (yw, ir) => {
		try {
			const { id } = yw.params

			if (!id)
				return ir
					.status(400)
					.json({ response: "Параметр хоосон байна" })

			await query("DELETE FROM ebarimt.barimt WHERE id = ?", [id])

			return ir.status(200).json({ response: "Амжилттай устгагдлаа." })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},
}
