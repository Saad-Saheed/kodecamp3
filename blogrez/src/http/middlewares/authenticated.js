'use strict';

import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ApiCustomError from '../errors/api-custom-error.js';
const TOKEN_SECRET = process.env.TOKEN_SECRET;

function authenticated(req, _res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
        throw new ApiCustomError(
            'Access Denied, kindly login.',
            StatusCodes.UNAUTHORIZED,
        );
    }
    const token = authorizationHeader.split(' ')[1];

    try {
        const authUser = jwt.verify(token, TOKEN_SECRET);
        req.user = { id: authUser.id, username: authUser.username };
        next();
    } catch (error) {
        throw new ApiCustomError(
            `Access Denied, kindly login. ${error.message}`,
            StatusCodes.UNAUTHORIZED,
        );
    }
}

export default authenticated;
