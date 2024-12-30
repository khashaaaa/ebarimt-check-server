const Router = require("express")
const {
	createAccessType,
	editAccessType,
	deleteAccessType,
	showAllAccess,
} = require("../controller/access.controller")
const { authenticate } = require("../middleware/authenticate")

const AccessRouter = Router()

AccessRouter.get("/list", authenticate, showAllAccess)
AccessRouter.post("/create", authenticate, createAccessType)
AccessRouter.patch("/edit/:id", authenticate, editAccessType)
AccessRouter.delete("/delete/:id", authenticate, deleteAccessType)

module.exports = { AccessRouter }
