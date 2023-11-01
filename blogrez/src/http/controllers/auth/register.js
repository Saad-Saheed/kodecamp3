import Validator from "validatorjs";
import { StatusCodes } from "http-status-codes";
import {database} from "../../../libs/prisma.js";
import Auth from "../../../utils/auth.js";
import asyncWrapper from "../../middlewares/async-wrapper.js";

class RegisterController {
    constructor() {

    }

    register = asyncWrapper(async(req, res) =>{
            // validation rules
            const rules = {
                username: "required|string|unique: User, username",
                password: 'required|string|min:8|confirmed',
            };

            // validate request input
            let validation = new Validator(req.body, rules);

            const validatorPromise = new Promise((resolve) => {
                validation.checkAsync(() => { resolve(true); }, () => { resolve(false); });
            });
            const result = await validatorPromise;

            if (result) {
                const auth = new Auth;
                const hashed_password = await auth.hashPassword(req.body.password);

                const newUser = {
                    username: req.body.username,
                    password: hashed_password,
                    created_at: new Date(),
                    updated_at: new Date()
                };

                // generate and store token
                const createdUser = await database.user.create({ data: newUser, select: {id:true, username:true, created_at: true}});
                const access_token = await auth.generateToken({id: createdUser.id, username: createdUser.username});
                return res.status(StatusCodes.CREATED).header({ 'auth-token': access_token }).json({ status: "success", message: 'User Created Successfully', data: createdUser});

            } else {
                const errRes = {
                    status: "failed",
                    ...validation.errors
                }
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(errRes);
            }
    });

}

export default RegisterController;