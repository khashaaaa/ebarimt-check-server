const { getDB } = require("../config/connector")
const axios = require("axios")
const { NOT_FOUND, BAD_REQUEST } = require("../constant/response")

module.exports = {
	findOrganization: async (yw, ir) => {
		try {
			const { regNo } = yw.body

			if (!regNo) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			const regResponse = await axios.get(
				`${process.env.EBARIMT_URI}/api/info/check/getTinInfo?regNo=${regNo}`
			)

			if (regResponse.status !== 200) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			const tin = regResponse.data.data

			const tinResponse = await axios.get(
				`${process.env.EBARIMT_URI}/api/info/check/getInfo?tin=${tin}`
			)

			if (tinResponse.data.status === 500) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: tinResponse.data })
		} catch (error) {
			return ir.status(500).json({ response: error.message })
		}
	},

	createBranch: async (yw, ir) => {
		try {
			const branch = yw.body

			if (!branch.bizloc_cd) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = getDB()
			const collection = db.collection("bgf_hq_bizloc_mst")

			const result = await collection.insertOne(branch)

			return ir.status(201).json({
				response: "Амжилттай нэмэгдлээ",
				data: { ...branch, _id: result.insertedId },
			})
		} catch (error) {
			ir.status(500).json({
				response: error.message,
			})
		}
	},

	findBranch: async (yw, ir) => {
		try {
			const { bizloc_cd } = yw.body

			if (!bizloc_cd) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = getDB()
			const collection = db.collection("bgf_hq_bizloc_mst")

			const regResponse = await collection.findOne({ bizloc_cd })

			if (!regResponse) {
				return ir.status(404).json({ response: "Мэдээлэл олдсонгүй" })
			}

			const regNo = regResponse.bizco_no

			const vatResponse = await axios.get(
				`${process.env.EBARIMT_URI}/api/info/check/getTinInfo?regNo=${regNo}`
			)

			const tin = vatResponse.data.data

			const tinResponse = await axios.get(
				`${process.env.EBARIMT_URI}/api/info/check/getInfo?tin=${tin}`
			)

			const custom = {
				store_no: regResponse.bizloc_cd,
				company_name1: regResponse.comp_nm,
				company_name2: tinResponse.data.data.name,
				store_name: regResponse.bizloc_nm,
				reg_no: regResponse.bizco_no,
				vat_no: vatResponse.data.data,
				city_payer: tinResponse.data.data.cityPayer,
				vat_payer: tinResponse.data.data.vatPayer,
				date_reg: tinResponse.data.data.vatpayerRegisteredDate,
			}

			return ir.status(200).json({ response: custom })
		} catch (error) {
			return ir.status(500).json({ response: error.message })
		}
	},
}
