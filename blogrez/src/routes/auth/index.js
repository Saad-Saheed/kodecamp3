import { Router } from "express";
import RegisterController  from "../../http/controllers/auth/register.js";
import LoginController from "../../http/controllers/auth/login.js";
import authenticated from "../../http/middlewares/authenticated.js";
import Auth from "../../utils/auth.js";

const authRoutes = Router();

authRoutes.post("/register", new RegisterController().register);
authRoutes.post("/login",  new LoginController().login);
authRoutes.get("/me", authenticated, Auth.User);

export default authRoutes;