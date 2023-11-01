"use strict";

import Validator from "validatorjs";
import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/async-wrapper.js";
import Auth from "../../../utils/auth.js";

class LoginController {

    login = asyncWrapper(async (req, res) => {
        const reqUser = {
            username: req.body.username.trim(),
            password: req.body.password.trim()
        };

        const rules = {
            username: "required|string",
            password: "required|string|min:8"
        };

        const validation = new Validator(reqUser, rules);
        const auth = new Auth();

        if (validation.passes()) {
            const user = await auth.login(reqUser.username, reqUser.password);
            // generate and store token
            const payLoad = {
                id: parseInt(user.id, 10),
                username: user.username
            };
            const access_token = await auth.generateToken(payLoad);
            res.status(StatusCodes.OK).header({ 'auth-token': access_token }).json({ status: "success", message: "Login Successfully!"});
        } else {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "failed",
                ...validation.errors
            });
        }
    });
}

export default LoginController;