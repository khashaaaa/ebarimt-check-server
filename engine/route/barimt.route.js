const Router = require("express")
const {
	findBarimt,
	deleteBarimt,
	createBarimt,
	checkLotteryNumber,
	insertLotteryNumber,
	combineBarimtAmount,
	searchBarimt,
} = require("../controller/barimt.controller")
const { authenticate } = require("../middleware/authenticate")

const BarimtRouter = Router()

BarimtRouter.post("/create", authenticate, createBarimt)
BarimtRouter.post("/find", authenticate, findBarimt)
BarimtRouter.post("/search", authenticate, searchBarimt)
BarimtRouter.post("/combine", authenticate, combineBarimtAmount)
BarimtRouter.post("/lottery/check", authenticate, checkLotteryNumber)
BarimtRouter.post("/lottery/insert", authenticate, insertLotteryNumber)
BarimtRouter.delete("/delete/:id", authenticate, deleteBarimt)

module.exports = { BarimtRouter }
