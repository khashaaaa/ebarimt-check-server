const Router = require("express")
const {
	createAccessType,
	editAccessType,
	deleteAccessType,
	showAllAccess,
} = require("../controller/access.controller")

const AccessRouter = Router()

AccessRouter.get("/list", showAllAccess)
AccessRouter.post("/create", createAccessType)
AccessRouter.patch("/edit/:id", editAccessType)
AccessRouter.delete("/delete/:id", deleteAccessType)

module.exports = { AccessRouter }
