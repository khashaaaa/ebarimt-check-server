const { MongoInit } = require("../config/connector")
const { ObjectId } = require("mongodb")
const { BAD_REQUEST, NOT_FOUND } = require("../constant/response")

module.exports = {
	createBarimt: async (yw, ir) => {
		try {
			const barimtData = yw.body

			if (
				!barimtData.site ||
				!barimtData.salesdate ||
				!barimtData.saleshour ||
				!barimtData.storeid ||
				!barimtData.receiptno
			) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const collection = db.collection("barimt")

			const result = await collection.insertOne(barimtData)

			return ir.status(201).json({
				response: "Амжилттай нэмэгдлээ",
				data: { ...barimtData, _id: result.insertedId },
			})
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	checkLotteryNumber: async (yw, ir) => {
		try {
			let { storeid, receiptno, netsale } = yw.body

			netsale = parseFloat(netsale)

			if (!storeid || !receiptno || !netsale) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const collection = db.collection("barimt")

			const result = await collection.findOne({
				storeid,
				receiptno,
				netsale,
			})

			if (!result) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: result })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	insertLotteryNumber: async (yw, ir) => {
		try {
			const { id, pos_api_lottery } = yw.body

			if (!id || !pos_api_lottery) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const lotteryRegex = /^[A-Za-z]{2}\s?\d{8}$/

			if (!lotteryRegex.test(pos_api_lottery)) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const collection = db.collection("barimt")

			const result = await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { pos_api_lottery } }
			)

			if (result.matchedCount === 0) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: "Амжилттай хадгалагдлаа" })
		} catch (error) {
			return ir.status(500).json({ response: error.message })
		}
	},

	findBarimt: async (yw, ir) => {
		try {
			const { id, salesdate } = yw.body

			if (!id || !salesdate) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const collection = db.collection("barimt")

			const result = await collection.findOne({
				_id: new ObjectId(id),
				salesdate,
			})

			if (!result) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: result })
		} catch (error) {
			if (error.name === "BSONTypeError") {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			return ir.status(500).json({ response: error.message })
		}
	},

	searchBarimt: async (yw, ir) => {
		try {
			const { receiptno } = yw.body

			if (!receiptno) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const collection = db.collection("barimt")

			const result = await collection.findOne({
				receiptno,
			})

			if (!result) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: result })
		} catch (error) {
			if (error.name === "BSONTypeError") {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			return ir.status(500).json({ response: error.message })
		}
	},

	deleteBarimt: async (yw, ir) => {
		try {
			const { id } = yw.params

			if (!id || !ObjectId.isValid(id)) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const collection = db.collection("barimt")

			const result = await collection.deleteOne({ _id: new ObjectId(id) })

			if (result.deletedCount === 0) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: "Амжилттай устгагдлаа." })
		} catch (error) {
			ir.status(500).json({ response: error.message })
		}
	},

	combineBarimtAmount: async (yw, ir) => {
		try {
			const { receiptno } = yw.body

			if (!receiptno) {
				return ir
					.status(BAD_REQUEST.code)
					.json({ response: BAD_REQUEST.message })
			}

			const db = MongoInit()
			const coll = db.collection("barimt")

			const agg = [
				{ $match: { receiptno } },
				{
					$group: {
						_id: {
							receiptno: "$receiptno",
							pos_api_bill_id: "$pos_api_bill_id",
							pos_api_lottery: "$pos_api_lottery",
							salesdate: "$salesdate",
							storeid: "$storeid",
						},
						amount: { $sum: "$grosssale" },
						tax: { $sum: "$tax" },
						city_tax: { $sum: "$city_tax" },
					},
				},
			]

			const result = await coll.aggregate(agg).toArray()

			if (!result.length) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			const grosssale = result[0].amount

			const updateResult = await coll.updateMany(
				{ receiptno },
				{ $set: { grosssale } }
			)

			if (updateResult.modifiedCount === 0) {
				return ir
					.status(NOT_FOUND.code)
					.json({ response: NOT_FOUND.message })
			}

			return ir.status(200).json({ response: "Амжилттай шинэчлэгдлээ" })
		} catch (error) {
			return ir.status(500).json({ response: error.message })
		}
	},
}
