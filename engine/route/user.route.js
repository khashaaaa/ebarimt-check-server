const Router = require("express")
const {
	createUser,
	login,
	showUsers,
	deleteUser,
} = require("../controller/user.controller")
const { authenticate } = require("../middleware/authenticate")

const UserRouter = Router()

UserRouter.post("/login", login)
UserRouter.get("/list", authenticate, showUsers)
UserRouter.post("/create", createUser)
UserRouter.delete("/delete/:id", authenticate, deleteUser)

module.exports = { UserRouter }
