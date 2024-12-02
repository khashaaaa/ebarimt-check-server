const Router = require("express")
const { findBarimt, deleteBarimt } = require("../controller/barimt.controller")

const BarimtRouter = Router()

BarimtRouter.post("/find", findBarimt)
BarimtRouter.delete("/delete/:id", deleteBarimt)

module.exports = { BarimtRouter }
