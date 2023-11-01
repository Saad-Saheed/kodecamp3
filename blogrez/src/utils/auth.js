"use strict";

import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  {StatusCodes} from 'http-status-codes';
import {database} from '../libs/prisma.js';
import {exclude} from '../utils/helper.js';
import ApiCustomError from '../http/errors/api-custom-error.js';
import asyncWrapper from '../http/middlewares/async-wrapper.js';

const PASSWORD_SALT = process.env.PASSWORD_SALT;
const SALT_ROUND = process.env.SALT_ROUND;
const TOKEN_SECRET  = process.env.TOKEN_SECRET;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;

class Auth {

    /**
     * login method
     * @param {string} username 
     * @param {string} password 
     */
    async login(username, password) {
        const user = await  database.user.findUnique({where: {username: username}, select: {id: true, username: true, password: true}});            
        if(user && (await bcrypt.compare(password + PASSWORD_SALT, user.password))){
            return {id: user.id, username: user.username};
        }

        throw new ApiCustomError(`Invalid Credentials`, StatusCodes.UNAUTHORIZED);
    }

    /**
     * authenticated User
     * @param {Request} req
     * @param {Response} res  
     */
    static User =  asyncWrapper(async (req, res) => {  
        let user = await database.user.findUnique({where: {id: req.user.id}, include:{posts: true}});
        if(user){
            user = exclude(user, ['password']);
            return res.status(StatusCodes.OK).json({ status: "success", message: "Profile fetched successfully", data: user });
        }
        throw new ApiCustomError(`Unauthorized! kindly login`, StatusCodes.UNAUTHORIZED);
    });


    /**
     * generate Token
     * @param {object} payLoad 
     */
    async generateToken(payLoad) {
        const access_token = jwt.sign({...payLoad}, TOKEN_SECRET, {expiresIn: TOKEN_EXPIRE});
        return access_token;
    }

    /**
     * hash Password
     * @param {String} password 
     */
    async hashPassword(password){
        return await bcrypt.hash(password+PASSWORD_SALT, parseInt(SALT_ROUND, 10));
    }
}

export default Auth;