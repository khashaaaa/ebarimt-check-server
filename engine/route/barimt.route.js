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

const BarimtRouter = Router()

BarimtRouter.post("/create", createBarimt)
BarimtRouter.post("/find", findBarimt)
BarimtRouter.post("/search", searchBarimt)
BarimtRouter.post("/combine", combineBarimtAmount)
BarimtRouter.post("/lottery/check", checkLotteryNumber)
BarimtRouter.post("/lottery/insert", insertLotteryNumber)
BarimtRouter.delete("/delete/:id", deleteBarimt)

module.exports = { BarimtRouter }
