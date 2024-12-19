const Router = require("express")
const {
	createUser,
	login,
	showUsers,
	deleteUser,
} = require("../controller/user.controller")

const UserRouter = Router()

UserRouter.get("/list", showUsers)
UserRouter.post("/create", createUser)
UserRouter.post("/login", login)
UserRouter.delete("/delete/:id", deleteUser)

module.exports = { UserRouter }
