const Router = require("express")
const {
	findOrganization,
	findBranch,
	createBranch,
} = require("../controller/org.controller")
const { authenticate } = require("../middleware/authenticate")

const OrgRouter = Router()

OrgRouter.post("/find", authenticate, findOrganization)
OrgRouter.post("/branch/create", authenticate, createBranch)
OrgRouter.post("/branch/find", authenticate, findBranch)

module.exports = { OrgRouter }
