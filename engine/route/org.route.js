const Router = require("express")
const {
	findOrganization,
	findBranch,
	createBranch,
} = require("../controller/org.controller")

const OrgRouter = Router()

OrgRouter.post("/find", findOrganization)
OrgRouter.post("/branch/create", createBranch)
OrgRouter.post("/branch/find", findBranch)

module.exports = { OrgRouter }
