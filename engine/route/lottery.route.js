const Router = require("express")
const {
	checkLotteryNumber,
	insertLotteryNumber,
} = require("../controller/lottery.controller")

const LotteryCheckRouter = Router()

LotteryCheckRouter.post("/check", checkLotteryNumber)
LotteryCheckRouter.post("/insert", insertLotteryNumber)

module.exports = { LotteryCheckRouter }
