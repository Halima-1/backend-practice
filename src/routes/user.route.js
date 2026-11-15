import { Router } from "express";
import { getUserById, getUsers, login, logout, registerUser } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.route("/register").post(registerUser);
userRoutes.route("/login").post(login);
userRoutes.route("/logout").post(logout);

userRoutes.route("/").get(getUsers);
userRoutes.route("/:id").get(getUserById);

export default userRoutes;